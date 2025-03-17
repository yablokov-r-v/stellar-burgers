import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';

interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const user = useSelector((state) => state.user.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};
