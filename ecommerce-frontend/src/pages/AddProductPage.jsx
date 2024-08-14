
import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Input, InputNumber, Modal } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AddProductPage = () => {
  const [form] = Form.useForm();
  const { token } = useSelector(state => state.user);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await axios.post('https://ecommerce-platform-jibh.onrender.com/api/products', values, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      Modal.success({
        content: 'Product added successfully!',
        onOk: () => navigate('/products'),
      });
    } catch (err) {
      console.error('Error adding product:', err);
      Modal.error({
        title: 'Error',
        content: 'Failed to add product.',
      });
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1>Add Product</h1>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item name="name" label="Product Name" rules={[{ required: true, message: 'Please input the product name!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please input the product description!' }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input the product price!' }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: 'Please input the product quantity!' }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Add Product</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProductPage;
