import { Navigate, useLocation } from 'react-router-dom';
import { UserRole } from '../constants/enums';
import { useAuthStore } from '../store/useAuthStore';

interface ProtectedRouteProps {
  accessRoles: UserRole[];
  children: JSX.Element;
}

export default function ProtectedRoute({ children, accessRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const user = useAuthStore((store) => store.user);
  if (!user) {
    return <Navigate state={{ from: location }} to='/login' replace />;
  }
  if (!user.activated) {
    return <Navigate to='/no-activate' state={{ from: location }} replace />;
  }
  if (!accessRoles.includes(user.role)) {
    return <Navigate to='/no-access' replace />;
  }
  return children;
}
