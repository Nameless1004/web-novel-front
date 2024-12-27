// src/components/PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const PrivateRoute = ({ element, ...rest }) => {
  const { accessToken } = useAuthStore();

  return (
    <Route
      {...rest}
      element={accessToken ? element : <Navigate to="/login" replace />}
    />
  );
};

export default PrivateRoute;
