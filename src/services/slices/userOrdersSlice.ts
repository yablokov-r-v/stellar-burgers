import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

interface UserOrdersState {
  orders: TOrder[];
  order: TOrder | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserOrdersState = {
  orders: [],
  order: null,
  status: 'idle',
  error: null
};

export const fetchUserOrders = createAsyncThunk(
  'userOrders/fetchUserOrders',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'userOrders/fetchOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch user orders';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.order = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch order by number';
      });
  }
});

export const userOrdersReducer = userOrdersSlice.reducer;
