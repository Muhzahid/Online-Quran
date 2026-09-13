import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../components/loaders/Loader';

export function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user, token, isLoading } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();

  if (isLoading || (token && !user)) {
    return <Loader message="Checking authentication..." />;
  }

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    const fallback =
      user?.role === 'admin'
        ? '/admin/dashboard'
        : user?.role === 'teacher'
          ? '/teacher/dashboard'
          : '/student/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { isAuthenticated, user, token, isLoading } = useSelector(
    (state) => state.auth
  );

  if (isLoading || (token && !user)) {
    return <Loader message="Loading..." />;
  }

  if (isAuthenticated && user) {
    const fallback =
      user.role === 'admin'
        ? '/admin/dashboard'
        : user.role === 'teacher'
          ? '/teacher/dashboard'
          : '/student/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}

export function StudentRoute() {
  return <ProtectedRoute allowedRoles={['student']} />;
}

export function TeacherRoute() {
  return <ProtectedRoute allowedRoles={['teacher']} />;
}

export function AdminRoute() {
  return <ProtectedRoute allowedRoles={['admin']} />;
}
