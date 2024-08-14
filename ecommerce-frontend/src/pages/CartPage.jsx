import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Modal, Spin, Alert, Typography, message, InputNumber } from 'antd';
import { DeleteOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingItem, setRemovingItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get('https://ecommerce-platform-jibh.onrender.com/api/cart', config);
      setCartItems(response.data.items || []);
    } catch (err) {
      console.error('Error fetching cart items:', err);
      setError('Failed to fetch cart items');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async () => {
    if (!removingItem) return;

    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.delete(`https://ecommerce-platform-jibh.onrender.com/api/cart/${removingItem._id}`, config);

      if (response.status === 200) {
        setCartItems(prevItems => prevItems.filter(item => item._id !== removingItem._id));
        message.success('Item removed from cart');
      } else {
        throw new Error('Failed to remove item');
      }
    } catch (err) {
      console.error('Error removing item:', err);
      message.error('Failed to remove item');
    } finally {
      setRemovingItem(null);
    }
  };

  const confirmRemove = (item) => {
    Modal.confirm({
      title: 'Are you sure?',
      content: (
        <>
          {item.product && (
            <>
              <Paragraph><strong>Title:</strong> {item.product.name}</Paragraph>
              <Paragraph><strong>Description:</strong> {item.product.description}</Paragraph>
            </>
          )}
          <Paragraph><strong>Quantity:</strong> {item.quantity}</Paragraph>
        </>
      ),
      onOk: () => {
        setRemovingItem(item);
        handleRemoveItem();
      },
    });
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.put(
        `https://ecommerce-platform-jibh.onrender.com/api/cart/${itemId}`,
        { quantity: newQuantity },
        config
      );

      if (response.status === 200) {
        setCartItems(prevItems =>
          prevItems.map(item =>
            item._id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
        message.success('Quantity updated successfully');
      } else {
        throw new Error('Failed to update quantity');
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      message.error('Failed to update quantity');
    }
  };

  const increaseQuantity = (itemId, currentQuantity) => {
    handleQuantityChange(itemId, currentQuantity + 1);
  };

  const decreaseQuantity = (itemId, currentQuantity) => {
    if (currentQuantity > 1) {
      handleQuantityChange(itemId, currentQuantity - 1);
    }
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message="Error" description={error} type="error" />;
  if (cartItems.length === 0) return <Alert message="No Items" description="Your cart is empty." type="info" />;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Title level={1} style={styles.title}>Cart</Title>
      </div>
      <div style={styles.cartList}>
        {cartItems.map((item) => (
          <Card
            key={item._id}
            style={styles.card}
            actions={[
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => confirmRemove(item)}
              >
                Remove
              </Button>
            ]}
          >
            <Card.Meta
              title={item.product ? item.product.name : 'Product name not available'}
              description={
                <>
                  <Paragraph>Description: {item.product ? item.product.description : 'Description not available'}</Paragraph>
                  <Paragraph>
                    Quantity: 
                    <div style={styles.quantityContainer}>
                      <Button 
                        icon={<MinusOutlined />} 
                        onClick={() => decreaseQuantity(item._id, item.quantity)} 
                        disabled={item.quantity <= 1}
                        style={styles.quantityButton}
                      />
                      <InputNumber 
                        min={1}
                        value={item.quantity}
                        readOnly
                        style={styles.quantityInput}
                      />
                      <Button 
                        icon={<PlusOutlined />} 
                        onClick={() => increaseQuantity(item._id, item.quantity)}
                        style={styles.quantityButton}
                      />
                    </div>
                  </Paragraph>
                </>
              }
            />
          </Card>
        ))}
      </div>
      <div style={styles.checkoutButtonContainer}>
        <Button
          type="primary"
          size="large"
          onClick={handleProceedToCheckout}
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '90%',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    margin: 0,
  },
  cartList: {
    marginBottom: '20px',
  },
  card: {
    marginBottom: '16px',
  },
  quantityContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  quantityButton: {
    margin: '0 4px',
  },
  quantityInput: {
    width: '60px',
    textAlign: 'center',
    margin: '0 4px',
  },
  checkoutButtonContainer: {
    textAlign: 'right',
  },
};

export default CartPage;
