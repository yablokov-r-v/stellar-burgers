import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/userOrdersSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  /** TODO: взять переменную из стора */
  const orders = useSelector((state: RootState) => state.userOrders.orders);

  const { status: ingredientsStatus } = useSelector(
    (state) => state.ingredients
  );

  useEffect(() => {
    if (ingredientsStatus === 'idle') {
      dispatch(fetchIngredients());
    }
    dispatch(fetchUserOrders());
  }, [dispatch, ingredientsStatus]);

  return <ProfileOrdersUI orders={orders} />;
};
