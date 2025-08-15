import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown
} from './burgerConstructorSlice';

describe('Редьюсер конструктора бургера', () => {
  it('должен добавить ингредиент и обновить счётчики', () => {
    // Создаём тестовый ингредиент
    const ingredient = {
      _id: 'ing-1',
      name: 'Сыр',
      type: 'main',
      proteins: 0,
      fat: 0,
      carbohydrates: 0,
      calories: 0,
      price: 10,
      image: '',
      image_mobile: '',
      image_large: ''
    };

    // Добавляем ингредиент через экшен addIngredient
    const stateAfterAdd = reducer(undefined, addIngredient(ingredient));

    // Проверяем, что ингредиент добавлен в массив
    expect(stateAfterAdd.ingredients).toHaveLength(1);
    // Проверяем, что счётчик для ингредиента увеличился
    expect(stateAfterAdd.ingredientsCounters[ingredient._id]).toBe(1);
  });

  it('должен удалить ингредиент и обновить счётчики', () => {
    // Создаём тестовый ингредиент
    const ingredient = {
      _id: 'ing-2',
      name: 'Котлета',
      type: 'main',
      proteins: 0,
      fat: 0,
      carbohydrates: 0,
      calories: 0,
      price: 20,
      image: '',
      image_mobile: '',
      image_large: ''
    };

    // Добавляем ингредиент
    const stateAfterAdd = reducer(undefined, addIngredient(ingredient));

    // Удаляем ингредиент по его id
    const idToRemove = stateAfterAdd.ingredients[0].id;
    const stateAfterRemove = reducer(stateAfterAdd, removeIngredient(idToRemove));

    // Проверяем, что ингредиент удалён
    expect(stateAfterRemove.ingredients).toHaveLength(0);
    // Проверяем, что счётчик для ингредиента удалён
    expect(stateAfterRemove.ingredientsCounters[ingredient._id]).toBeUndefined();
  });

  it('должен изменять порядок ингредиентов (вверх и вниз)', () => {
    // Создаём два ингредиента
    const a = { _id: 'a', name: 'A', type: 'main', proteins:0,fat:0,carbohydrates:0,calories:0,price:1,image:'',image_mobile:'',image_large:'' };
    const b = { _id: 'b', name: 'B', type: 'main', proteins:0,fat:0,carbohydrates:0,calories:0,price:2,image:'',image_mobile:'',image_large:'' };

    // Добавляем оба ингредиента
    let state = reducer(undefined, addIngredient(a));
    state = reducer(state, addIngredient(b));
    const idB = state.ingredients[1].id;

    // Перемещаем B вверх (с позиции 1 на 0)
    state = reducer(state, moveIngredientUp(1));
    expect(state.ingredients[0].id).toBe(idB);

    // Перемещаем B вниз (с позиции 0 на 1)
    state = reducer(state, moveIngredientDown(0));
    expect(state.ingredients[1].id).toBe(idB);
  });
});
