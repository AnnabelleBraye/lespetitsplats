import recipeFactory from '../factories/recipe-factory.js';

const recipesListElt = document.getElementById('recipes-list');

const generateRecipesList = (recipes) => {
  recipesListElt.innerHTML = '';
  recipes.forEach((recipe) => {
    const recipeTemplate = recipeFactory(recipe);
    const recipeElt = recipeTemplate.getRecipeCard();
    recipesListElt.appendChild(recipeElt);
  });
};

export default generateRecipesList;
