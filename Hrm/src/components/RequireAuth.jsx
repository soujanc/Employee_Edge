import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RequireAuth = ({ children }) => {
  const { currentUser, loading } = useAuth();

  // If authentication state is still loading, show a loading indicator or null
  if (loading) {
    return null; // or a loading indicator
  }

  // If currentUser is not available, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If currentUser is available, render the children
  return children;
};

export default RequireAuth;
