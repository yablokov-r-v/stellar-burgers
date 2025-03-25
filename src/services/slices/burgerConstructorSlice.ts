import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '../../utils/burger-api';
import { v4 as uuidv4 } from 'uuid';

interface ConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  ingredientsCounters: { [key: string]: number };
  orderRequest: boolean;
  orderModalData: TOrder | null;
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
  ingredientsCounters: {},
  orderRequest: false,
  orderModalData: null
};

export const createOrder = createAsyncThunk(
  'burgerConstructor/createOrder',
  async (ingredientsIds: string[], { dispatch }) => {
    const response = await orderBurgerApi(ingredientsIds);
    return response.order;
  }
);

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const ingredient = action.payload;
        state.ingredients.push(ingredient);

        // Увеличиваем счётчик для этого ингредиента
        if (state.ingredientsCounters[ingredient._id]) {
          state.ingredientsCounters[ingredient._id] += 1;
        } else {
          state.ingredientsCounters[ingredient._id] = 1;
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: uuidv4()
        }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      const ingredientId = action.payload;

      // Находим удаляемый ингредиент
      const removedIngredient = state.ingredients.find(
        (item) => item.id === ingredientId
      );

      if (removedIngredient) {
        // Уменьшаем счётчик для этого ингредиента
        if (state.ingredientsCounters[removedIngredient._id]) {
          state.ingredientsCounters[removedIngredient._id] -= 1;

          // Если счётчик стал нулевым, удаляем запись
          if (state.ingredientsCounters[removedIngredient._id] === 0) {
            delete state.ingredientsCounters[removedIngredient._id];
          }
        }

        state.ingredients = state.ingredients.filter(
          (item) => item.id !== ingredientId
        );
      }
    },

    setBun: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        // Очищаем счётчик для старой булки
        if (state.bun) {
          delete state.ingredientsCounters[state.bun._id];
        }

        // Устанавливаем новую булку
        state.bun = action.payload;

        // Для новой булки счётчик всегда равен 2
        state.ingredientsCounters[action.payload._id] = 2;
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: uuidv4()
        }
      })
    },

    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index > 0) {
        // Меняем местами текущий элемент с предыдущим
        [state.ingredients[index], state.ingredients[index - 1]] = [
          state.ingredients[index - 1],
          state.ingredients[index]
        ];
      }
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < state.ingredients.length - 1) {
        // Меняем местами текущий элемент со следующим
        [state.ingredients[index], state.ingredients[index + 1]] = [
          state.ingredients[index + 1],
          state.ingredients[index]
        ];
      }
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
      state.ingredientsCounters = {};
    },
    setOrderModalData: (state, action: PayloadAction<TOrder | null>) => {
      state.orderModalData = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.bun = null;
        state.ingredients = [];
        state.ingredientsCounters = {};
      })
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  setBun,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
  setOrderModalData
} = burgerConstructorSlice.actions;
export default burgerConstructorSlice.reducer;
