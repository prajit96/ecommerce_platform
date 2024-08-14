// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('authToken'); // Check if the user is authenticated

  return isAuthenticated ? <Element {...rest} /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
