import recipesList from '../data/recipe.js';
import recipeFactory from './factories/recipe-factory.js';

const init = async () => {
  const recipesListElt = document.getElementById('recipes-list');
  const recipes = recipesList;

  document.addEventListener('DOMContentLoaded', function () {
    recipes.forEach((recipe) => {
      const recipeTemplate = recipeFactory(recipe);
      const recipeElt = recipeTemplate.getRecipeCard();
      recipesListElt.appendChild(recipeElt);
    });
  });
};

init();
