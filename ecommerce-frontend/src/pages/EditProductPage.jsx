
import React, { useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Input, InputNumber, Modal } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const EditProductPage = () => {
  const [form] = Form.useForm();
  const { id } = useParams(); // Get the product ID from the URL
  const { token } = useSelector(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://ecommerce-platform-jibh.onrender.com/api/products/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        form.setFieldsValue(response.data);
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    };
    fetchProduct();
  }, [id, form, token]);

  const onFinish = async (values) => {
    try {
      await axios.put(`https://ecommerce-platform-jibh.onrender.com/api/products/${id}`, values, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      Modal.success({
        content: 'Product updated successfully!',
        onOk: () => navigate('/products'),
      });
    } catch (err) {
      console.error('Error updating product:', err);
      Modal.error({
        title: 'Error',
        content: 'Failed to update product.',
      });
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1>Edit Product</h1>
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
          <Button type="primary" htmlType="submit">Update Product</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditProductPage;
