import recipeFactory from '../factories/recipe-factory.js';
import stringUtils from './string-utils.js';
import storageUtils from './storage-utils.js';
import multiselect from '../../component/multiselect.js';
import searchBar from '../../component/search-bar.js';

const recipesListElt = document.getElementById('recipes-list');

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
  multiselects.forEach((select) => {
    multiselect.generateSelectList(select.id);
  });
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
  recipes.forEach((recipe) => {
    const recipeTemplate = recipeFactory(recipe);
    const recipeElt = recipeTemplate.getRecipeCard();
    recipesListElt.appendChild(recipeElt);
  });
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

const getRecipesFilteredBySearchAndAllTags = (tags, isAddingTag) => {
  let recipes = storageUtils.getDataStorage('recipes', []);
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

  // Get recipes in storage, or recipes filtered by seach-filter and tags
  if (isAddingTag) {
    recipes = storageUtils.getDataStorage('recipes-filtered', recipes);
  }
  // else {
  const filter = storageUtils.getDataStorage('search-filter', '');
  if (filter) {
    recipes = recipes.filter((recipe) =>
      searchBar.filterByNameDescIngredient(recipe, filter)
    );
  }

  // Check if a recipes contains every selected tags
  const list1 = filterRecipesByIngredients(recipes, ingredientsList);
  const list2 = filterRecipesByAppliances(recipes, appliancesList);
  const list3 = filterRecipesByUstensils(recipes, ustensilsList);
  const filteredRecipes = [];

  for (const recipe of recipes) {
    if (
      list1.includes(recipe) &&
      list2.includes(recipe) &&
      list3.includes(recipe)
    ) {
      filteredRecipes.push(recipe);
    }
  }

  return filteredRecipes;
};

/**
 * Filter recipesList by ingredient tags
 * @param {*} recipesList
 * @param {*} tagsList
 * @returns
 */
const filterRecipesByIngredients = (recipesList, tagsList) => {
  const newList = [];

  for (const recipe of recipesList) {
    let isAllTagsPresent = true;

    tagsList.forEach((tag) => {
      if (
        !recipe.ingredients
          .map((elt) => stringUtils.formatSelectName(elt.ingredient))
          .includes(tag)
      ) {
        isAllTagsPresent = false;
        return false;
      }
    });

    if (isAllTagsPresent) {
      newList.push(recipe);
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

  for (const recipe of recipesList) {
    let isAllTagsPresent = true;

    tagsList.forEach((tag) => {
      if (recipe.appliance !== tag) {
        isAllTagsPresent = false;
        return false;
      }
    });

    if (isAllTagsPresent) {
      newList.push(recipe);
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

  for (const recipe of recipesList) {
    let isAllTagsPresent = true;

    tagsList.forEach((tag) => {
      if (
        !recipe.ustensils
          .map((elt) => stringUtils.formatSelectName(elt))
          .includes(tag)
      ) {
        isAllTagsPresent = false;
        return false;
      }
    });

    if (isAllTagsPresent) {
      newList.push(recipe);
    }
  }

  return newList;
};

export default {
  updateDynamicContent,
  generateRecipesList,
  updateRecipesCount,
  getRecipesFilteredBySearchAndAllTags,
};
