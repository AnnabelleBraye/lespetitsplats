import recipeFactory from '../factories/recipe-factory.js';
import stringUtils from './string-utils.js';
import storageUtils from './storage-utils.js';
import multiselect from '../../component/multiselect.js';
import searchBar from '../../component/search-bar.js';

const recipesListElt = document.getElementById('recipes-list');
const noRecipeElt = document.getElementById('no-recipe');

/**
 * Update recipes list, recipes counter and multiselects lists
 * @param {*} recipes
 */
const updateDynamicContent = () => {
  generateRecipesList();
  updateRecipesCount();

  const multiselects = document.querySelectorAll(
    '#ingredients-select, #appliances-select, #ustensils-select'
  );

  for (let i = 0; i < multiselects.length; i++) {
    multiselect.generateSelectList(multiselects[i].id);
  }
};

/**
 * Generate recipes list depending on recipes-filtered or recipes
 */
const generateRecipesList = () => {
  const recipes = storageUtils.getDataStorage(
    'recipes-filtered',
    storageUtils.getDataStorage('recipes', [])
  );
  recipesListElt.innerHTML = '';

  if (recipes && recipes.length > 0) {
    showRecipesList(true);
    for (let i = 0; i < recipes.length; i++) {
      const recipeTemplate = recipeFactory(recipes[i]);
      const recipeElt = recipeTemplate.getRecipeCard();
      recipesListElt.appendChild(recipeElt);
    }
  } else {
    showRecipesList(false);
    noRecipeElt.innerHTML = '';
    const filter = storageUtils.getDataStorage('search-filter', '');
    const noRecipeTitle = document.createElement('h2');
    noRecipeTitle.classList.add('md:text-2xl');
    const subTitle = document.createElement('h3');
    subTitle.classList.add('md:text-lg');
    subTitle.textContent =
      'Vous pouvez chercher "tarte aux pommes", "poisson", ...';
    noRecipeTitle.classList.add('font-light');
    noRecipeTitle.innerHTML = `Aucune recette ne contient "${filter}".`;
    noRecipeElt.appendChild(noRecipeTitle);
    noRecipeElt.appendChild(subTitle);
  }
};

const showRecipesList = (show) => {
  if (show) {
    recipesListElt.classList.remove('hidden');
    noRecipeElt.classList.add('hidden');
    noRecipeElt.classList.remove('flex');
  } else {
    recipesListElt.classList.add('hidden');
    noRecipeElt.classList.remove('hidden');
    noRecipeElt.classList.add('flex');
  }
};

/**
 * Update the counter of recipes
 */
const updateRecipesCount = () => {
  const recipes = storageUtils.getDataStorage(
    'recipes-filtered',
    storageUtils.getDataStorage('recipes', [])
  );
  const countRecipesElt = document.getElementById('count-recipes');
  countRecipesElt.innerText = `${recipes.length} ${
    recipes.length > 1 ? 'recettes' : 'recette'
  }`;
};

/**
 * Filter recipes list by all tags
 * @param {*} recipes
 * @param {*} tags
 * @returns
 */
const filterRecipesByAllTags = (recipes, tags) => {
  const filteredRecipes = [];
  const ingredientsList = [];
  const appliancesList = [];
  const ustensilsList = [];
  for (let [key, value] of tags.entries()) {
    if (value === 'ingredients-select') {
      ingredientsList.push(key);
    } else if (value === 'appliances-select') {
      appliancesList.push(key);
    } else if (value === 'ustensils-select') {
      ustensilsList.push(key);
    }
  }

  // Check if a recipes contains every selected tags
  const list1 = filterRecipesByIngredients(recipes, ingredientsList);
  const list2 = filterRecipesByAppliances(recipes, appliancesList);
  const list3 = filterRecipesByUstensils(recipes, ustensilsList);
  for (let i = 0; i < recipes.length; i++) {
    if (
      list1.includes(recipes[i]) &&
      list2.includes(recipes[i]) &&
      list3.includes(recipes[i])
    ) {
      filteredRecipes.push(recipes[i]);
    }
  }

  localStorage.setItem('recipes-filtered', JSON.stringify(filteredRecipes));
  return filteredRecipes;
};

/**
 * Get recipes list filtered by searchbar THEN by all tags
 * @param {*} tags
 * @param {*} isAddingTag
 * @returns
 */
const updateRecipesFilteredBySearchAndAllTags = (tags, isAddingTag) => {
  let recipes = storageUtils.getDataStorage('recipes', []);

  // Get recipes in storage, or recipes filtered by seach-filter and tags
  if (isAddingTag) {
    recipes = storageUtils.getDataStorage('recipes-filtered', recipes);
  }

  const filter = storageUtils.getDataStorage('search-filter', '');
  if (filter && filter.length >= 3) {
    const list = [];
    for (let i = 0; i < recipes.length; i++) {
      if (searchBar.filterByNameDescIngredient(recipes[i], filter)) {
        list.push(recipes[i]);
      }
    }

    recipes = list;
  }

  filterRecipesByAllTags(recipes, tags);
};

/**
 * Filter recipesList by ingredient tags
 * @param {*} recipesList
 * @param {*} tagsList
 * @returns
 */
const filterRecipesByIngredients = (recipesList, tagsList) => {
  const newList = [];

  for (let i = 0; i < recipesList.length; i++) {
    let isAllTagsPresent = true;

    const namesList = [];
    for (let j = 0; j < recipesList[i].ingredients.length; j++) {
      namesList.push(
        stringUtils.formatSelectName(recipesList[i].ingredients[j].ingredient)
      );
    }

    for (let j = 0; j < tagsList.length; j++) {
      if (!namesList.includes(tagsList[j])) {
        isAllTagsPresent = false;
        break;
      }
    }

    if (isAllTagsPresent) {
      newList.push(recipesList[i]);
    }
  }

  return newList;
};

/**
 * Filter recipesList by appliances tags
 * @param {*} recipesList
 * @param {*} tagsList
 * @returns
 */
const filterRecipesByAppliances = (recipesList, tagsList) => {
  const newList = [];

  for (let i = 0; i < recipesList.length; i++) {
    let isAllTagsPresent = true;

    for (let j = 0; j < tagsList.length; j++) {
      if (recipesList[i].appliance !== tagsList[j]) {
        isAllTagsPresent = false;
        break;
      }
    }

    if (isAllTagsPresent) {
      newList.push(recipesList[i]);
    }
  }

  return newList;
};

/**
 * Filter recipesList by ustensils tags
 * @param {*} recipesList
 * @param {*} tagsList
 * @returns
 */
const filterRecipesByUstensils = (recipesList, tagsList) => {
  const newList = [];

  for (let i = 0; i < recipesList.length; i++) {
    let isAllTagsPresent = true;

    const namesList = [];
    for (let j = 0; j < recipesList[i].ustensils.length; j++) {
      namesList.push(stringUtils.formatSelectName(recipesList[i].ustensils[j]));
    }

    for (let j = 0; j < tagsList.length; j++) {
      if (!namesList.includes(tagsList[j])) {
        isAllTagsPresent = false;
        break;
      }
    }

    if (isAllTagsPresent) {
      newList.push(recipesList[i]);
    }
  }

  return newList;
};

/**
 * Sort recipes by name
 */
const orderRecipesByName = (recipes) => {
  return recipes.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
};

export default {
  updateDynamicContent,
  generateRecipesList,
  updateRecipesCount,
  filterRecipesByAllTags,
  updateRecipesFilteredBySearchAndAllTags,
  orderRecipesByName,
};
