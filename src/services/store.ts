import { configureStore } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/ingredientsSlice';
import burgerConstructorReducer from './slices/burgerConstructorSlice';
import { userReducer } from './slices/userSlice';
import { feedsReducer } from './slices/feedsSlice';
import { userOrdersReducer } from './slices/userOrdersSlice';
import { combineReducers } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  user: userReducer,
  feeds: feedsReducer,
  userOrders: userOrdersReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();

export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
