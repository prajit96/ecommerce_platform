import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/AuthSlice';
import { useNavigate } from 'react-router-dom';

const LogoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logout());
    navigate('/login'); // Redirect to login page after logout
  }, [dispatch, navigate]);

  return (
    <div>
      <h1>You have been logged out</h1>
    </div>
  );
};

export default LogoutPage;
