import React, { useState } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../api/routes';
import { Form, Input, Button, Typography, notification } from 'antd';

const { Title } = Typography;

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(API_ROUTES.USERS, { name, email, password });
      if (response.data.message === 'User already exists') {
        notification.warning({
          message: 'User Already Registered',
          description: 'Please go to the login page to sign in.',
        });
      } else {
        notification.success({
          message: 'Signup Successful',
          description: 'You have successfully signed up!',
        });
        // Optionally redirect to the login page
        // history.push('/login');
      }
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message || error.message : 'Signup failed. Please try again.';
      notification.error({
        message: 'Signup Failed',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Title level={2}>Signup</Title>
      <Form
        layout="vertical"
        onFinish={handleSignup}
        style={styles.form}
      >
        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter your name' }]}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Signup
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

export default SignupPage;
