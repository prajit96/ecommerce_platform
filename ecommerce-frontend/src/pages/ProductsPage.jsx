import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Form, Input, InputNumber, Modal, Spin, Alert, Typography, notification  } from 'antd';
import { EditOutlined, DeleteOutlined, HeartOutlined, HeartFilled, ShoppingCartOutlined } from '@ant-design/icons';

const { Title } = Typography;

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
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

  const handleAddProduct = async (values) => {
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      await axios.post('https://ecommerce-platform-jibh.onrender.com/api/products', values, config);
      fetchProducts();
      setIsModalVisible(false);
      form.resetFields();
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  const handleEditProduct = async (values) => {
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      await axios.put(`https://ecommerce-platform-jibh.onrender.com/api/products/${editProductId}`, values, config);
      fetchProducts();
      setIsModalVisible(false);
      form.resetFields();
      setEditProductId(null);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await axios.delete(`https://ecommerce-platform-jibh.onrender.com/api/products/${productId}`, config);
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
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
        const response = await axios.post('https://ecommerce-platform-jibh.onrender.com/api/wishlist', { productId }, config);
  
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
   
  
  

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      await axios.post('https://ecommerce-platform-jibh.onrender.com/api/cart', { productId }, config);
      notification.success({
        message: 'Cart Updated',
        description: `Item has been added to your Cart.`,
        placement: 'topRight',
      });
      // Optionally, we can show a notification or update local state
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const showAddProductModal = () => {
    setIsEditing(false);
    setIsModalVisible(true);
  };

  const showEditProductModal = (product) => {
    setEditProductId(product._id);
    form.setFieldsValue({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity
    });
    setIsEditing(true);
    setIsModalVisible(true);
  };

  const confirmDelete = (productId) => {
    Modal.confirm({
      title: 'Are you sure?',
      content: 'Do you really want to delete this product?',
      onOk: () => handleDeleteProduct(productId),
    });
  };

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message="Error" description={error} type="error" />;
  if (products.length === 0) return <Alert message="No Products" description="No products available at the moment." type="info" />;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Title level={1} style={styles.title}>Products</Title>
        <Button type="primary" onClick={showAddProductModal}>
          Add Product
        </Button>
      </div>
      <div style={styles.productList}>
        {products.map((product) => (
          <Card
            key={product._id}
            style={styles.card}
            actions={[
              
              <Button
                type="text"
                icon={wishlist.has(product._id) ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined style={{ color: 'gray' }} />}
                onClick={() => handleWishlistToggle(product._id)}
              />,
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                onClick={() => handleAddToCart(product._id)}
              >
                
              </Button>,
              <Button 
                type="primary"
                icon={<EditOutlined />}
                onClick={() => showEditProductModal(product)}
              >
                Edit
              </Button>,
              <Button
                type="danger"
                icon={<DeleteOutlined />}
                onClick={() => confirmDelete(product._id)}
              >
                Delete
              </Button>
            ]}
          >
            <Card.Meta
              title={product.name}
              description={`Description: ${product.description} - Price: $${product.price} - Quantity: ${product.quantity}`}
            />
          </Card>
        ))}
      </div>
      <Modal
        title={isEditing ? 'Edit Product' : 'Add Product'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          onFinish={isEditing ? handleEditProduct : handleAddProduct}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Please input the product name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input the product description!' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please input the product price!' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: 'Please input the product quantity!' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditing ? 'Update Product' : 'Add Product'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
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
  productList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  },
  card: {
    width: '100%',
  },
};

export default ProductsPage;
