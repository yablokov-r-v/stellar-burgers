import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch, useSelector } from '../../services/store';
import {
  addIngredient,
  setBun
} from '../../services/slices/burgerConstructorSlice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const ingredientsCounters = useSelector(
      (state) => state.burgerConstructor.ingredientsCounters
    );

    const ingredientCount = ingredientsCounters[ingredient._id] || 0;

    const handleAdd = () => {
      if (ingredient.type === 'bun') {
        dispatch(setBun({ ...ingredient, id: Date.now().toString() }));
      } else {
        dispatch(addIngredient({ ...ingredient, id: Date.now().toString() }));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={ingredientCount}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
