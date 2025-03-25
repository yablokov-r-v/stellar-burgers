import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feedsSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { useLocation } from 'react-router-dom';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  /** TODO: взять переменную из стора */
  const { orders, status, error } = useSelector(
    (state: RootState) => state.feeds
  );

  const { status: ingredientsStatus } = useSelector(
    (state) => state.ingredients
  );

  useEffect(() => {
    if (ingredientsStatus === 'idle') {
      dispatch(fetchIngredients());
    }
    dispatch(fetchFeeds());
  }, [dispatch, ingredientsStatus]);

  if (status === 'loading') {
    return <Preloader />;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  if (!orders.length && status === 'succeeded') {
    return <div>Нет заказов для отображения</div>;
  }

  const handleRefresh = () => {
    dispatch(fetchFeeds());
  };

  return <FeedUI orders={orders} handleGetFeeds={handleRefresh} />;
};
