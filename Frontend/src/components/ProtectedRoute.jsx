import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check for the token in localStorage
  const token = localStorage.getItem('token');
  // If there's no token, redirect the user to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  // If there is a token, render the child component (the page they wanted to go to)
  return children;
};

export default ProtectedRoute;