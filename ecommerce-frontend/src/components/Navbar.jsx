import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/userSlice'; // Adjust the import path if necessary

const Navbar = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('authToken'); // Remove the token from localStorage
  };

  return (
    <Menu mode="horizontal">
      <Menu.Item key="home">
        <Link to="/">Home</Link>
      </Menu.Item>
      <Menu.Item key="courses">
        <Link to="/courses">Courses</Link>
      </Menu.Item>
      <Menu.Item key="products">
        <Link to="/products">Products</Link>
      </Menu.Item>
      <Menu.Item key="wishlist">
        <Link to="/wishlist">Wishlist</Link>
      </Menu.Item>
      <Menu.Item key="cart">
        <Link to="/cart">Cart</Link>
      </Menu.Item>
      {token ? (
        <>
          <Menu.Item key="logout">
            <Link to="/" onClick={handleLogout}>Logout</Link>
          </Menu.Item>
        </>
      ) : (
        <>
          <Menu.Item key="login">
            <Link to="/login">Login</Link>
          </Menu.Item>
          <Menu.Item key="signup">
            <Link to="/signup">Signup</Link>
          </Menu.Item>
        </>
      )}
    </Menu>
  );
};

export default Navbar;
