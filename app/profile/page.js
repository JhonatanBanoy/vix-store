'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, message, Spin, Upload, Avatar } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import { api } from '../../lib/api';
import { cloudinaryConfig } from '../config/cloudinary';

export default function ProfilePage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        const response = await api.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        form.setFieldsValue({
          name: response.data.name,
          email: response.data.email,
        });
        setImageUrl(response.data.profileImage);
      } catch (error) {
        message.error('No se pudo cargar el perfil');
      }
      setLoading(false);
    };
    fetchProfile();
  }, [router, form]);

  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', cloudinaryConfig.uploadPreset);
      
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
        formData
      );
      
      setImageUrl(response.data.secure_url);
      return response.data.secure_url;
    } catch (error) {
      message.error('Error al subir la imagen');
      return '';
    }
  };

  const onFinish = async (values) => {
    setSaving(true);
    const token = localStorage.getItem('token');
    try {
      await api.put('/auth/profile', {
        ...values,
        profileImage: imageUrl
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Perfil actualizado correctamente');
      
      // Actualizar la información del usuario en localStorage
      const user = JSON.parse(localStorage.getItem('user')) || {};
      localStorage.setItem('user', JSON.stringify({
        ...user,
        name: values.name,
        email: values.email,
        profileImage: imageUrl
      }));
      
    } catch (error) {
      message.error('Error al actualizar el perfil');
    }
    setSaving(false);
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><Spin size="large" /></div>;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card title="Perfil de Usuario" style={{ width: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={async (file) => {
              await handleImageUpload(file);
              return false;
            }}
          >
            <div>
              {imageUrl ? (
                <Avatar 
                  src={imageUrl} 
                  size={100} 
                  style={{ cursor: 'pointer' }}
                />
              ) : (
                <Avatar 
                  icon={<UserOutlined />} 
                  size={100} 
                  style={{ cursor: 'pointer' }}
                />
              )}
              <div style={{ marginTop: 8 }}>
                <Button icon={<UploadOutlined />} type="link">
                  Cambiar foto
                </Button>
              </div>
            </div>
          </Upload>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="Nombre"
            name="name"
            rules={[{ required: true, message: 'Por favor ingrese su nombre' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Por favor ingrese su email' }, { type: 'email', message: 'Ingrese un email válido' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Nueva Contraseña"
            name="password"
            rules={[{ min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }]}
          >
            <Input.Password placeholder="Dejar en blanco para no cambiar" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={saving} block>
              Guardar Cambios
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
} 