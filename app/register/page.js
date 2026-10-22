'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { api } from '../../lib/api';
import { cloudinaryConfig } from '../config/cloudinary';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

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
    setLoading(true);
    try {
      const { name, email, password } = values;
      const payload = { 
        name, 
        email, 
        password, 
        role: 'user',
        profileImage: imageUrl || `https://api.dicebear.com/7.x/avatars/svg?seed=${email}`
      };
      const response = await api.post('/auth/register', payload);
      message.success('Registro exitoso');
      router.push('/login');
    } catch (error) {
      message.error('Error al registrar usuario');
    }
    setLoading(false);
  };



  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <Card title="Registro de Usuario" style={{ width: 400 }}>
        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
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
            rules={[
              { required: true, message: 'Por favor ingrese su email' },
              { type: 'email', message: 'Ingrese un email válido' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[
              { required: true, message: 'Por favor ingrese su contraseña' },
              { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirmar Contraseña"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Por favor confirme su contraseña' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Las contraseñas no coinciden'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Foto de perfil"
            name="profileImage"
          >
            <Upload
              accept="image/*"
              listType="picture-card"
              showUploadList={false}
              beforeUpload={async (file) => {
                await handleImageUpload(file);
                return false; // prevent default upload
              }}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Subir Foto</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Registrarse
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <a href="/login">¡Ya tienes cuenta? Inicia sesión aquí!</a>
          </div>
        </Form>
      </Card>
    </div>
  );
} 