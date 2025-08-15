import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './ingredientsSlice';
import burgerConstructorReducer from './burgerConstructorSlice';
import { userReducer } from './userSlice';
import { feedsReducer } from './feedsSlice';
import { userOrdersReducer } from './userOrdersSlice';

describe('Инициализация rootReducer', () => {
  it('должен вернуть корректное начальное состояние при вызове с undefined и неизвестным экшеном', () => {
    // Формируем rootReducer из всех слайсов
    const rootReducer = combineReducers({
      ingredients: ingredientsReducer,
      burgerConstructor: burgerConstructorReducer,
      user: userReducer,
      feeds: feedsReducer,
      userOrders: userOrdersReducer
    });

    // Вызываем rootReducer с undefined и несуществующим экшеном
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    // Проверяем начальные состояния всех частей стора
    expect(state.ingredients).toEqual({ items: [], status: 'idle', error: null });
    expect(state.burgerConstructor).toEqual({
      bun: null,
      ingredients: [],
      ingredientsCounters: {},
      orderRequest: false,
      orderModalData: null
    });
    expect(state.user).toEqual({ user: null, status: 'idle', error: null });
    expect(state.feeds).toEqual({ orders: [], total: 0, totalToday: 0, status: 'idle', error: null });
    expect(state.userOrders).toEqual({ orders: [], order: null, status: 'idle', error: null });
  });
});
