import { Navigate, useLocation } from 'react-router-dom';
import { getUser } from '../utils/storage';

export default function ProtectedRoute({ children, role }) {
  const user = getUser();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (role && user.role !== role) return <Navigate to={user.role === 'teacher' ? '/teacher' : '/dashboard'} replace />;
  return children;
}