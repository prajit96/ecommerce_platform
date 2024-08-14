import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Input, Form, List, Card, Spin, Alert, Modal, notification } from 'antd';
import 'antd/dist/reset.css';
import { HeartOutlined, HeartFilled, ShoppingCartOutlined } from '@ant-design/icons';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form] = Form.useForm();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);
  const [wishlist, setWishlist] = useState(new Set()); 

  useEffect(() => {
    fetchCourses();
    fetchWishlist();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get('https://ecommerce-platform-jibh.onrender.com/api/courses', config);
      setCourses(response.data.docs || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to fetch courses');
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

  const handleAddOrUpdateCourse = async (values) => {
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      const url = isEditing
        ? `https://ecommerce-platform-jibh.onrender.com/api/courses/${editCourseId}`
        : 'https://ecommerce-platform-jibh.onrender.com/api/courses';
      const method = isEditing ? 'put' : 'post';

      const response = await axios[method](url, values, config);

      if (response.status === (isEditing ? 200 : 201)) {
        fetchCourses();
        notification.success({
          message: isEditing ? 'Course Updated Successfully' : 'Course Added Successfully',
          description: `The course "${values.title}" has been ${isEditing ? 'updated' : 'added'} successfully.`,
        });
        form.resetFields();
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error saving course:', err);
      notification.error({
        message: 'Error Saving Course',
        description: `Failed to save course: ${err.message}`,
      });
    } finally {
      setIsEditing(false);
      setEditCourseId(null);
    }
  };

  const handleEditCourse = (course) => {
    setIsEditing(true);
    setEditCourseId(course._id);
    form.setFieldsValue({
      title: course.title,
      description: course.description,
      price: course.price,
      duration: course.duration,
      instructor: course.instructor?._id || '' // Set the instructor ID for editing
    });
    setIsAdding(true);
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      await axios.delete(`https://ecommerce-platform-jibh.onrender.com/api/courses/${courseId}`, config);
      fetchCourses();
      notification.success({
        message: 'Course Deleted Successfully',
        description: 'The course has been deleted successfully.',
      });
    } catch (err) {
      console.error('Error deleting course:', err);
      notification.error({
        message: 'Error Deleting Course',
        description: `Failed to delete course: ${err.message}`,
      });
    }
  };

  const handleWishlistToggle = async (courseId, courseName) => {
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
  
      const isInWishlist = wishlist.has(courseId);
  
      if (isInWishlist) {
        setWishlist((prevWishlist) => {
          const newWishlist = new Set(prevWishlist);
          newWishlist.delete(courseId);
          return newWishlist;
        });
        await axios.delete(`https://ecommerce-platform-jibh.onrender.com/api/wishlist/${courseId}`, config);
  
        notification.success({
          message: 'Wishlist Updated',
          description: `${courseName} has been removed from your wishlist.`,
          placement: 'topRight',
        });
      } else {
        setWishlist((prevWishlist) => {
          const newWishlist = new Set(prevWishlist);
          newWishlist.add(courseId);
          return newWishlist;
        });
        const response = await axios.post('https://ecommerce-platform-jibh.onrender.com/api/wishlist', { courseId }, config);
  
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

  // const handleAddToCart = async (courseId) => {
  //   try {
  //     const token = localStorage.getItem('authToken');
  //     const config = {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`
  //       }
  //     };
  //     await axios.post('https://ecommerce-platform-jibh.onrender.com/api/cart', { courseId }, config);
  //     notification.success({
  //       message: 'Cart Updated',
  //       description: `Item has been added to your Cart.`,
  //       placement: 'topRight',
  //     });
  //     // Optionally, we can show a notification or update local state
  //   } catch (err) {
  //     console.error('Error adding to cart:', err);
  //   }
  // };

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message={error} type="error" showIcon />;
  if (courses.length === 0) return <Alert message="No courses available" type="info" showIcon />;

  return (
    <div style={{ width: '80%', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Courses</h1>
        <Button type="primary" onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Cancel' : 'Add Course'}
        </Button>
      </div>
      {(isAdding || isEditing) && (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddOrUpdateCourse}
          style={{ marginBottom: '20px' }}
        >
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Title is required' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Description is required' }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Price is required' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="duration" label="Duration" rules={[{ required: true, message: 'Duration is required' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="instructor" label="Instructor ID" rules={[{ required: true, message: 'Instructor ID is required' }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditing ? 'Update Course' : 'Add Course'}
            </Button>
          </Form.Item>
        </Form>
      )}
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={courses}
        renderItem={course => (
          <List.Item>
            <Card
              title={course.title}
              extra={
                <>
                  <Button
                type="text"
                icon={wishlist.has(course._id) ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined style={{ color: 'gray' }} />}
                onClick={() => handleWishlistToggle(course._id)}
              />
                  <Button
                    type="link"
                    onClick={() => handleEditCourse(course)}
                    style={{ marginRight: '10px' }}
                  >
                    Update
                  </Button>
                  <Button
                    type="link"
                    danger
                    onClick={() => Modal.confirm({
                      title: 'Confirm Deletion',
                      content: 'Are you sure you want to delete this course?',
                      onOk: () => handleDeleteCourse(course._id)
                    })}
                  >
                    Delete
                  </Button>
                  {/* <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                onClick={() => handleAddToCart(course._id)}
              ></Button> */}
                </>
              }
            >
              <p>Description: {course.description}</p>
              <p>Price: ${course.price}</p>
              <p>Duration: {course.duration}</p>
              <p>Instructor: {course.instructor?.name || 'N/A'}</p> {/* Display instructor name */}
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default CoursesPage;
