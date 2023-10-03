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

const generateSelectsLists = (recipes, tagsList) => {
  const { ingredients, appliances, ustensils } = recipes.reduce(
    (prev, curr) => {
      curr.ingredients.forEach((elt) => {
        const ingredient = stringUtils.formatSelectName(elt.ingredient);
        if (!prev.ingredients.has(ingredient)) {
          prev.ingredients.set(ingredient, tagsList.includes(ingredient));
        }
      });

      curr.ustensils.forEach((ustensil) => {
        if (!prev.ustensils.has(ustensil)) {
          prev.ustensils.set(ustensil, tagsList.includes(ustensil));
        }
      });

      if (!prev.appliances.has(curr.appliance)) {
        prev.appliances.set(curr.appliance, tagsList.includes(curr.appliance));
      }

      return prev;
    },
    { ingredients: new Map(), appliances: new Map(), ustensils: new Map() }
  );

  const selectIngredients = document.querySelector('#ingredients-select');
  const selectAppliances = document.querySelector('#appliances-select');
  const selectUstensils = document.querySelector('#ustensils-select');

  createListboxElts(selectIngredients, ingredients);
  createListboxElts(selectAppliances, appliances);
  createListboxElts(selectUstensils, ustensils);
};

const updateRecipesCount = (count) => {
  const countRecipesElt = document.getElementById('count-recipes');
  countRecipesElt.innerText = `${count} ${count >= 1 ? 'recettes' : 'recette'}`;
};

const createListboxElts = (listboxElt, list) => {
  const inputElt = listboxElt.querySelector('input');
  const clearInputElt = listboxElt.querySelector('div > img');
  clearInputElt.inputElt = inputElt;
  clearInputElt.parentListbox = listboxElt;
  clearInputElt.addEventListener('click', clearInputValue, false);

  inputElt.value = '';
  inputElt.selectList = list;
  inputElt.addEventListener('click', stopPropagation, false);
  inputElt.addEventListener('input', filterAndUpdate);

  updateList(listboxElt, list);
};

const clearInputValue = (e) => {
  e.stopPropagation();

  e.target.inputElt.value = '';
  updateList(e.target.parentListbox, e.target.inputElt.selectList);
};

const filterAndUpdate = (e) => {
  const filter = stringUtils.trimAndLowerCase(e.target.value);

  const filteredMap = mapUtils.filterMap(e.target.selectList, filter);
  updateList(e.target.parentElement.parentElement, filteredMap);
};

const updateList = (listboxElt, list) => {
  console.log(`listboxElt`, listboxElt);
  const ulElt = listboxElt.querySelector('ul');
  ulElt.innerHTML = '';
  list.forEach((value, key) => {
    let classes =
      'flex justify-between py-2.5 p-4 hover:bg-yellow-400 aria-selected:bg-yellow-400 aria-selected:font-bold';

    const liElt = document.createElement('li');
    liElt.setAttribute('aria-selected', value);
    liElt.textTag = key;
    liElt.addEventListener('click', selectElt);
    liElt.className = classes;
    const imgClass = !value ? 'invisible' : '';
    liElt.innerHTML = `
        ${key}
        <img class="${imgClass}" src="./src/assets/svg/xmark-rounded.svg">
    `;
    ulElt.appendChild(liElt);
  });
};

const selectElt = (e) => {
  e.stopPropagation();
  const liElt = e.target;
  liElt.setAttribute(
    'aria-selected',
    liElt.getAttribute('aria-selected') === 'false' ? 'true' : 'false'
  );
  const imgElt = liElt.querySelector('img');
  imgElt.classList.toggle('invisible');

  storageUtils.updateTagsStorage(liElt);
};

const stopPropagation = (e) => {
  e.stopPropagation();
};

export default {
  updateDynamicContent,
  generateRecipesList,
  updateRecipesCount,
  generateSelectsLists,
};
