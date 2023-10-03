import stringUtils from './string-utils.js';
import recipesUtils from './recipes.js';

const updateTagsStorage = (selectListId, liElt) => {
  const tags = localStorage.getItem(`${selectListId}-tags`)
    ? JSON.parse(localStorage.getItem(`${selectListId}-tags`))
    : [];
  let isAddingTag = true;

  const name = stringUtils.formatSelectName(liElt.textTag);
  if (liElt.getAttribute('aria-selected') === 'true') {
    tags.push(name);
  } else {
    isAddingTag = false;
    tags.splice(
      tags.findIndex((tag) => tag === name),
      1
    );
  }

  localStorage.setItem(`${selectListId}-tags`, JSON.stringify(tags));
  updateRecipesStorage(selectListId, tags, isAddingTag);
};

const updateRecipesStorage = (selectListId, tags, isAddingTag) => {
  let recipes = getStorageData('recipes', []);
  if (isAddingTag) {
    recipes = getStorageData('recipes-filtered', recipes);
  } else {
    const list1 = filterRecipesByIngredients(
      recipes,
      getStorageData('ingredients-select-tags', [])
    );
    const list2 = filterRecipesByAppliances(
      recipes,
      getStorageData('appliances-select-tags', [])
    );
    const list3 = filterRecipesByUstensils(
      recipes,
      getStorageData('ustensils-select-tags', [])
    );
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
    recipes = filteredRecipes;
  }
  const list = [];

  // Check if recipe contains every selected tags
  for (const recipe of recipes) {
    let isAllTagsPresent = true;
    switch (selectListId) {
      case 'ingredients-select':
        tags.forEach((tag) => {
          if (
            !recipe.ingredients
              .map((elt) => stringUtils.formatSelectName(elt.ingredient))
              .includes(tag)
          ) {
            isAllTagsPresent = false;
            return false;
          }
        });
        break;
      case 'appliances-select':
        tags.forEach((tag) => {
          if (recipe.appliance !== tag) {
            isAllTagsPresent = false;
            return false;
          }
        });
        break;
      case 'ustensils-select':
        tags.forEach((tag) => {
          if (
            !recipe.ustensils
              .map((elt) => stringUtils.formatSelectName(elt))
              .includes(tag)
          ) {
            isAllTagsPresent = false;
            return false;
          }
        });
        break;
    }

    if (isAllTagsPresent) {
      list.push(recipe);
    }
  }

  localStorage.setItem('recipes-filtered', JSON.stringify(list));
  recipesUtils.updateDynamicContent(list);
};

const getStorageData = (name, value) => {
  return localStorage.getItem(name)
    ? JSON.parse(localStorage.getItem(name))
    : value;
};

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

const updateSelectedSelectItem = (selectListId, textTag) => {
  const selectList = new Map(getStorageData(`${selectListId}-list`, []));
  selectList.set(textTag, selectList.get(textTag) === true ? false : true);
  localStorage.setItem(`${selectListId}-list`, JSON.stringify([...selectList]));
};

export default { updateTagsStorage, getStorageData, updateSelectedSelectItem };
