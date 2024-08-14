import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Form, Spin, Alert, notification, Skeleton, Typography } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form] = Form.useForm();
  const [wishlist, setWishlist] = useState(new Set());

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get('https://ecommerce-platform-jibh.onrender.com/api/products', config);
      setProducts(response.data.docs || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get('https://ecommerce-platform-jibh.onrender.com/api/wishlist', config);
      const wishlistItems = response.data.items || [];
      setWishlist(new Set(wishlistItems.map(item => item.course || item.product)));
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  };

  const handleWishlistToggle = async (productId, productName) => {
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const isInWishlist = wishlist.has(productId);

      if (isInWishlist) {
        setWishlist((prevWishlist) => {
          const newWishlist = new Set(prevWishlist);
          newWishlist.delete(productId);
          return newWishlist;
        });
        await axios.delete(`https://ecommerce-platform-jibh.onrender.com/api/wishlist/${productId}`, config);

        notification.success({
          message: 'Wishlist Updated',
          description: `${productName} has been removed from your wishlist.`,
          placement: 'topRight',
        });
      } else {
        setWishlist((prevWishlist) => {
          const newWishlist = new Set(prevWishlist);
          newWishlist.add(productId);
          return newWishlist;
        });
        await axios.post('https://ecommerce-platform-jibh.onrender.com/api/wishlist', { productId }, config);

        notification.success({
          message: 'Wishlist Updated',
          description: `Item has been added to your wishlist.`,
          placement: 'topRight',
        });
      }

      fetchWishlist();
    } catch (err) {
      console.error('Error toggling wishlist:', err.response || err.message || err);

      // Display a notification for the error
      notification.error({
        message: 'Error',
        description: 'This item already in your Wishlist. Please check.',
        placement: 'topRight',
      });

      fetchWishlist();
    }
  };

  if (loading) return <Skeleton size="large" />;
  if (error) return <Alert message="Error" description={error} type="error" />;
  if (products.length === 0) return <Alert message="No Products" description="No products available at the moment." type="info" />;

  return (
    <div style={styles.container}>
      Some Product Features...
      <div style={styles.productList}>
        {products.map((product) => (
          <Card
            key={product._id}
            style={styles.card}
            actions={[
              <Button
                type="text"
                icon={wishlist.has(product._id) ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined style={{ color: 'gray' }} />}
                onClick={() => handleWishlistToggle(product._id, product.name)}
              />
            ]}
          >
            <div style={styles.cardContent}>
              <Title level={4} style={styles.productTitle}>{product.name}</Title>
              <Paragraph style={styles.productDescription}>{product.description}</Paragraph>
              <Text strong style={styles.productPrice}>Price: ${product.price}</Text>
              {/* <Text style={styles.productQuantity}>Quantity: {product.quantity}</Text> */}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontwidth:'700',
  },
  productList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  },
  card: {
    width: '100%',
    backgroundColor: '#f9f9f9',  // Light background color
    borderRadius: '8px',  // Rounded corners
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  // Subtle shadow for depth
    padding: '16px',  // Padding inside the card
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  productTitle: {
    marginBottom: '8px',
  },
  productDescription: {
    marginBottom: '8px',
  },
  productPrice: {
    fontSize: '14px',
    marginBottom: '8px',
  },
  productQuantity: {
    fontSize: '14px',
    color: 'gray',
  },
};

export default HomePage;
