'use client';

import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, InputNumber, message, Image, Switch, Tag, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API_URL as BASE_URL } from '../../lib/api';
import { useRouter } from 'next/navigation';


const API_URL = `${BASE_URL}/api/products`;

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const router = useRouter();

  const columns = [
    {
      title: 'Imagen',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (
        <Image
          width={50}
          src={image || 'https://via.placeholder.com/50'}
          fallback="https://via.placeholder.com/50"
        />
      ),
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Precio',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price}`
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock) =>
        stock > 0 ? stock : <Tag color="red">Sin stock</Tag>,
    },
    {
      title: 'Disponible',
      dataIndex: 'isActive',
      key: 'isActive',
      filters: [
        { text: 'Visibles', value: true },
        { text: 'Ocultos', value: false },
      ],
      onFilter: (value, record) => (record.isActive !== false) === value,
      render: (isActive, record) => (
        <Switch
          checked={isActive !== false}
          loading={togglingId === record._id}
          onChange={(checked) => handleToggleActive(record, checked)}
          checkedChildren="Sí"
          unCheckedChildren="No"
        />
      ),
    },
    {
      title: 'Descripción',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <div>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Editar
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: getAuthHeaders()
      });
      setProducts(response.data);
    } catch (error) {
      message.error('Error al cargar los productos');
    }
  };

  const handleAddProduct = async (values) => {
    setLoading(true);
    try {
      if (editingProduct) {
        await axios.put(`${API_URL}/${editingProduct._id}`, values, {
          headers: getAuthHeaders()
        });
        message.success('Producto actualizado exitosamente');
      } else {
        await axios.post(API_URL, values, {
          headers: getAuthHeaders()
        });
        message.success('Producto agregado exitosamente');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingProduct(null);
      fetchProducts();

      if (Number(values.stock) === 0) {
        message.info(
          'El producto quedó con stock 0. Puedes ocultarlo con el interruptor "Disponible".'
        );
      }
    } catch (error) {
      message.error('Error al guardar el producto');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: getAuthHeaders()
      });
      message.success('Producto eliminado exitosamente');
      fetchProducts();
    } catch (error) {
      message.error('Error al eliminar el producto');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      ...product,
      isActive: product.isActive !== false,
    });
    setIsModalVisible(true);
  };

  const handleToggleActive = async (product, checked) => {
    setTogglingId(product._id);

    // Actualización optimista: se ve al instante
    setProducts((prev) =>
      prev.map((p) => (p._id === product._id ? { ...p, isActive: checked } : p))
    );

    try {
      await axios.put(
        `${API_URL}/${product._id}`,
        { isActive: checked },
        { headers: getAuthHeaders() }
      );
      message.success(
        checked
          ? `"${product.name}" ya es visible en la tienda`
          : `"${product.name}" se ocultó de la tienda`
      );
    } catch (error) {
      // Si falla, se revierte el cambio
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, isActive: !checked } : p
        )
      );
      message.error('No se pudo actualizar la disponibilidad');
    } finally {
      setTogglingId(null);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingProduct(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard de Productos</h1>
      <Card 
        title="Lista de Productos" 
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setIsModalVisible(true)}
          >
            Agregar Producto
          </Button>
        }
      >
        <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          {products.filter((p) => p.isActive !== false).length} visibles ·{' '}
          {products.filter((p) => p.isActive === false).length} ocultos
        </Typography.Text>

        <Table 
          columns={columns} 
          dataSource={products} 
          rowKey="_id"
          rowClassName={(record) => (record.isActive === false ? 'opacity-40' : '')}
          pagination={{ pageSize: 10, showSizeChanger: false }}
        />
      </Card>

      <Modal
        title={editingProduct ? "Editar Producto" : "Agregar Nuevo Producto"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleAddProduct}
          layout="vertical"
          initialValues={{ isActive: true }}
        >
          <Form.Item
            name="name"
            label="Nombre del Producto"
            rules={[{ required: true, message: 'Por favor ingrese el nombre del producto' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label="Precio"
            rules={[{ required: true, message: 'Por favor ingrese el precio' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Stock"
            rules={[{ required: true, message: 'Por favor ingrese el stock' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Descripción"
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Visible en la tienda"
            valuePropName="checked"
          >
            <Switch checkedChildren="Sí" unCheckedChildren="No" />
          </Form.Item>

          <Form.Item
            name="image"
            label="URL de la Imagen"
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingProduct ? "Actualizar" : "Agregar"} Producto
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Dashboard; 