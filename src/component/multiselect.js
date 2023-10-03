import recipes from '../javascript/utils/recipes.js';

const openList = (e) => {
  const select = e.currentTarget;
  const selectId = select.id;

  // const storedRecipes = storageUtils.getStorageData('recipes', []);
  // const selectTagsList = storageUtils.getStorageData(`${selectId}-tags`, []);
  // recipes.generateSelectsLists(storedRecipes, selectTagsList);

  const listbox = select.querySelector('[role="listbox"]');
  if (listbox.classList.contains('hidden')) {
    recipes.generateSelectList(selectId);
  }

  const ul = listbox.querySelector('ul');
  select.classList.toggle('rounded-b-xl');
  ul.classList.toggle('hidden');
  listbox.classList.toggle('hidden');
};

export default openList;
