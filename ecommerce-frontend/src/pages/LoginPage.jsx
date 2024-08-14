import React, { useState } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../api/routes';
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/userSlice';
import { Form, Input, Button, Typography, notification } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(API_ROUTES.LOGIN, values);
      const token = response.data.token;
      console.log('Token:', token);

      // Store the token in local storage
      localStorage.setItem('authToken', token);

      // Dispatch the token to Redux
      dispatch(setToken(token));

      notification.success({
        message: 'Login Successful',
        description: 'You have successfully logged in!',
      });

      // Redirect to the product page
      navigate('/products'); // Redirect to the products page
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message || error.message : 'Login failed. Please try again.';
      notification.error({
        message: 'Login Failed',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Title level={2}>Login</Title>
      <Form
        layout="vertical"
        onFinish={handleLogin}
        style={styles.form}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
        >
          <Input
            type="email"
            placeholder="Enter your email"
          />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password
            placeholder="Enter your password"
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    backgroundColor: '#fff',
  },
  form: {
    width: '100%',
  },
};

export default LoginPage;
