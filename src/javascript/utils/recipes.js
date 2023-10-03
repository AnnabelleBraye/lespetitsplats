import recipeFactory from '../factories/recipe-factory.js';
import stringUtils from './string-utils.js';
import storageUtils from './storage-utils.js';
import mapUtils from './map-utils.js';

const recipesListElt = document.getElementById('recipes-list');

const updateDynamicContent = (recipes) => {
  generateRecipesList(recipes);
  updateRecipesCount(recipes.length);
};

const generateRecipesList = (recipes) => {
  recipesListElt.innerHTML = '';
  recipes.forEach((recipe) => {
    const recipeTemplate = recipeFactory(recipe);
    const recipeElt = recipeTemplate.getRecipeCard();
    recipesListElt.appendChild(recipeElt);
  });
};

const generateSelectList = (selectId) => {
  const storedRecipes = storageUtils.getStorageData('recipes', []);
  const selectTagsList = storageUtils.getStorageData(`${selectId}-tags`, []);

  const list = storedRecipes.reduce((prev, curr) => {
    switch (selectId) {
      case 'ingredients-select':
        curr.ingredients.forEach((elt) => {
          const ingredient = stringUtils.formatSelectName(elt.ingredient);
          if (!prev.has(ingredient)) {
            prev.set(ingredient, selectTagsList.includes(ingredient));
          }
        });
        break;
      case 'appliances-select':
        const appliance = stringUtils.formatSelectName(curr.appliance);
        if (!prev.has(appliance)) {
          prev.set(appliance, selectTagsList.includes(appliance));
        }
        break;
      case 'ustensils-select':
        curr.ustensils.forEach((elt) => {
          const ustensil = stringUtils.formatSelectName(elt);
          if (!prev.has(ustensil)) {
            prev.set(ustensil, selectTagsList.includes(ustensil));
          }
        });
        break;
    }

    return prev;
  }, new Map());

  const selectElt = document.getElementById(selectId);
  localStorage.setItem(`${selectId}-list`, JSON.stringify([...list]));
  createListboxElts(selectElt, list);
};

const updateRecipesCount = (count) => {
  const countRecipesElt = document.getElementById('count-recipes');
  countRecipesElt.innerText = `${count} ${count >= 1 ? 'recettes' : 'recette'}`;
};

const createListboxElts = (selectElt, list) => {
  const inputElt = selectElt.querySelector('input');
  const clearInputElt = selectElt.querySelector('div > img');
  clearInputElt.inputElt = inputElt;
  clearInputElt.parentListbox = selectElt;
  clearInputElt.addEventListener('click', clearInputValue, false);

  inputElt.value = '';
  inputElt.addEventListener('click', stopPropagation, false);
  inputElt.addEventListener('input', filterAndUpdate);

  updateSelectList(selectElt, list);
};

const clearInputValue = (e) => {
  e.stopPropagation();

  e.target.inputElt.value = '';
  updateSelectList(e.target.parentListbox, e.target.inputElt.selectList);
};

const filterAndUpdate = (e) => {
  const filter = stringUtils.trimAndLowerCase(e.target.value);

  const selectElt = e.target.parentElement.parentElement.parentElement;
  const selectList = new Map(
    storageUtils.getStorageData(`${selectElt.id}-list`, [])
  );
  const filteredMap = mapUtils.filterMap(selectList, filter);
  updateSelectList(selectElt, filteredMap);
};

const updateSelectList = (selectElt, list) => {
  const ulElt = selectElt.querySelector('ul');
  ulElt.innerHTML = '';
  list.forEach((value, key) => {
    let classes =
      'flex justify-between py-2.5 p-4 hover:bg-yellow-400 aria-selected:bg-yellow-400 aria-selected:font-bold';

    const liElt = document.createElement('li');
    liElt.setAttribute('aria-selected', value);
    liElt.textTag = key;
    liElt.selectListId = selectElt.id;
    liElt.addEventListener('click', selectListItem);
    liElt.className = classes;
    const imgClass = !value ? 'invisible' : '';
    liElt.innerHTML = `
    ${key}
    <img class="${imgClass}" src="./src/assets/svg/xmark-rounded.svg">
    `;
    ulElt.appendChild(liElt);
  });
};

const selectListItem = (e) => {
  e.stopPropagation();
  const liElt = e.target;
  const selectListId = liElt.selectListId;

  liElt.setAttribute(
    'aria-selected',
    liElt.getAttribute('aria-selected') === 'false' ? 'true' : 'false'
  );

  const imgElt = liElt.querySelector('img');
  imgElt.classList.toggle('invisible');
  storageUtils.updateSelectedSelectItem(selectListId, liElt.textTag);
  storageUtils.updateTagsStorage(selectListId, liElt);
};

const stopPropagation = (e) => {
  e.stopPropagation();
};

export default {
  updateDynamicContent,
  generateRecipesList,
  updateRecipesCount,
  generateSelectList,
};
