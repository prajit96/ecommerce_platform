import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Typography, Alert, Spin, Divider, Button } from 'antd';

const { Title, Paragraph, Text } = Typography;

const CheckoutPage = () => {
  const [order, setOrder] = useState(null);
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutSuccessful, setCheckoutSuccessful] = useState(false);

  useEffect(() => {
    fetchCheckoutDetails();
  }, []);

  const fetchCheckoutDetails = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.post('https://ecommerce-platform-jibh.onrender.com/api/checkout', {}, config);

      if (response.status === 200) {
        setOrder(response.data.order);
        setBill(response.data.bill);
        setCheckoutSuccessful(true);
      }
    } catch (err) {
      console.error('Error fetching checkout details:', err);
      setError('Failed to fetch checkout details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message="Error" description={error} type="error" />;

  return (
    <div style={styles.container}>
      {order && (
        <div>
          <Card title="Order Details" bordered={false} style={styles.card}>
            <Paragraph><strong>User ID:</strong> {order.user}</Paragraph>
            <Paragraph><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</Paragraph>
            <Paragraph><strong>Payment Status:</strong> {order.paymentStatus}</Paragraph>
            <Divider />
            <Title level={4}>Items:</Title>
            {order.items.map((item) => (
              <div key={item._id} style={styles.item}>
                <Text strong>{item.product.name}</Text>
                <Paragraph>
                  {item.product.description} <br />
                  <strong>Price:</strong> ${item.product.price.toFixed(2)} <br />
                  <strong>Quantity:</strong> {item.quantity}
                </Paragraph>
              </div>
            ))}
          </Card>
          {bill && (
            <Card title="Bill Details" bordered={false} style={styles.card}>
              <Paragraph><strong>Total Amount:</strong> ${bill.totalAmount.toFixed(2)}</Paragraph>
              <Paragraph><strong>Taxes:</strong> ${bill.taxes.toFixed(2)}</Paragraph>
              <Paragraph><strong>Discounts:</strong> -${bill.discounts.toFixed(2)}</Paragraph>
              <Paragraph><strong>Final Amount:</strong> ${bill.finalAmount.toFixed(2)}</Paragraph>
            </Card>
          )}
          {checkoutSuccessful && (
            <div style={styles.thankYouMessage}>
              <Title level={3}>Thank you for shopping with us!</Title>
              <Paragraph>Your order has been placed successfully. We appreciate your business!</Paragraph>
              <Button type="primary" onClick={() => window.location.href = '/products'}>
                Go to Product
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    marginBottom: '20px',
  },
  item: {
    marginBottom: '15px',
  },
  thankYouMessage: {
    marginTop: '20px',
    textAlign: 'center',
  }
};

export default CheckoutPage;
