import recipeFactory from '../factories/recipe-factory.js';

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

const updateRecipesCount = (count) => {
  const countRecipesElt = document.getElementById('count-recipes');
  countRecipesElt.innerText = `${count} ${count >= 1 ? 'recettes' : 'recette'}`;
};

export default {
  updateDynamicContent,
  generateRecipesList,
  updateRecipesCount,
};
