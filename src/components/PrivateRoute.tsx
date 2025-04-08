import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    // Afficher un indicateur de chargement
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
} 