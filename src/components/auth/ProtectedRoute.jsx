// src/components/auth/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, authLoading } = useAuth();

  if (authLoading) return null; // Or a spinner

  if (!user) return <Navigate to="/login" />;

  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to="/home" />; // Redirect users away from admin pages
  }

  return children;
};