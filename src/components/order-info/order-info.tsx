import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { useParams, useLocation } from 'react-router-dom';
import { fetchOrderByNumber } from '../../services/slices/userOrdersSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const dispatch = useDispatch();
  const isProfileOrders = location.pathname.includes('/profile/orders');

  const orderData = useSelector((state) =>
    isProfileOrders
      ? state.userOrders.orders.find((order) => order.number === Number(number))
      : state.feeds.orders.find((order) => order.number === Number(number))
  );

  const ingredients = useSelector((state) => state.ingredients.items);
  const ingredientsStatus = useSelector((state) => state.ingredients.status);
  const fetchedOrderData = useSelector((state) => state.userOrders.order);

  useEffect(() => {
    if (!orderData) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
    if (ingredientsStatus === 'idle') {
      dispatch(fetchIngredients());
    }
  }, [dispatch, number, orderData, ingredientsStatus]);

  const orderInfo = useMemo(() => {
    const data = orderData || fetchedOrderData;

    if (!data || !ingredients.length) return null;

    const date = new Date(data.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = data.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...data,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, fetchedOrderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
