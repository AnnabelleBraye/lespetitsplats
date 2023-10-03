import recipes from '../javascript/utils/recipes.js';
import storageUtils from '../javascript/utils/storage-utils.js';

const openList = (e) => {
  const select = e.currentTarget;

  const storedRecipes = storageUtils.getStorageData('recipes', []);
  const tagsList = storageUtils.getStorageData('tags', []);
  console.log(`ici, storedRecipes`, storedRecipes);
  recipes.generateSelectsLists(storedRecipes, tagsList);

  const listbox = select.querySelector('[role="listbox"]');

  const ul = listbox.querySelector('ul');
  select.classList.toggle('rounded-b-xl');
  ul.classList.toggle('hidden');
  listbox.classList.toggle('hidden');
};

export default openList;
