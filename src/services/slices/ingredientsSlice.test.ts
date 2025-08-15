import { ingredientsReducer, fetchIngredients } from './ingredientsSlice';

describe('Редьюсер ингредиентов', () => {
  it('должен установить статус "loading" при начале запроса', () => {
    // Отправляем экшен pending
    const state = ingredientsReducer(undefined, { type: fetchIngredients.pending.type });
    // Проверяем, что статус изменился на "loading"
    expect(state.status).toBe('loading');
  });

  it('должен сохранить ингредиенты и установить статус "succeeded" при успешном запросе', () => {
    // Массив тестовых ингредиентов
    const items = [
      {
        _id: '1',
        name: 'Тестовая булка',
        type: 'bun',
        proteins: 0,
        fat: 0,
        carbohydrates: 0,
        calories: 0,
        price: 1,
        image: '',
        image_mobile: '',
        image_large: ''
      }
    ];

    // Отправляем экшен fulfilled
    const state = ingredientsReducer(undefined, { type: fetchIngredients.fulfilled.type, payload: items });
    // Проверяем, что данные записаны в стор
    expect(state.items).toEqual(items);
    // Проверяем, что статус стал "succeeded"
    expect(state.status).toBe('succeeded');
  });

  it('должен сохранить ошибку и установить статус "failed" при ошибке запроса', () => {
    // Отправляем экшен rejected
    const state = ingredientsReducer(undefined, { type: fetchIngredients.rejected.type, error: { message: 'Network error' } });
    // Проверяем, что ошибка записана
    expect(state.error).toBe('Network error');
    // Проверяем, что статус стал "failed"
    expect(state.status).toBe('failed');
  });
});
