import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';

interface UnprotectedRouteProps {
  children: JSX.Element;
}

export const UnprotectedRoute: FC<UnprotectedRouteProps> = ({ children }) => {
  const user = useSelector((state) => state.user.user);
  const location = useLocation();

  if (user) {
    return <Navigate to='/' />;
  }

  return children;
};
