import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Spin, Alert, Button, Modal } from 'antd';
import { HeartFilled, DeleteOutlined } from '@ant-design/icons';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const response = await axios.get('https://ecommerce-platform-jibh.onrender.com/api/wishlist', config);
        console.log(response.data); // Inspect the response
        if (response.data && response.data.items && Array.isArray(response.data.items)) {
          setWishlist(response.data.items);
        } else {
          console.error('Unexpected data format:', response.data);
          setWishlist([]);
        }
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        setError('Failed to fetch wishlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      await axios.delete(`https://ecommerce-platform-jibh.onrender.com/api/wishlist/${productId}`, config);
      // Refresh wishlist state
      setWishlist(wishlist.filter(item => item._id !== productId));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  const confirmRemove = (productId) => {
    Modal.confirm({
      title: 'Are you sure?',
      content: 'Do you really want to remove this item from your wishlist?',
      onOk: () => handleRemoveFromWishlist(productId),
    });
  };

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message="Error" description={error} type="error" />;
  if (!wishlist.length) return <Alert message="No Items" description="Your wishlist is empty." type="info" />;

  return (
    <div style={styles.container}>
      {wishlist.map(item => {
        const product = item.product || {}; // Ensure product is defined
        const course = item.course || {};
        return (
          <Card key={item._id} style={styles.card}>
            <Card.Meta
              title={product.name || course.title ||'Unknown Product'}
              description={`Description: ${product.description || course.description ||'N/A'} `}
            />
            <div style={styles.actions}>
              <HeartFilled style={styles.heartIcon} />
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => confirmRemove(item._id)}
                style={styles.removeButton}
              >
                Remove
              </Button>
            </div>
          </Card>
        );
      })}
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
  card: {
    width: '300px',
    marginBottom: '20px',
  },
  heartIcon: {
    color: 'red',
    fontSize: '24px',
  },
  actions: {
    marginTop: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  removeButton: {
    color: 'red',
  },
};

export default WishlistPage;
