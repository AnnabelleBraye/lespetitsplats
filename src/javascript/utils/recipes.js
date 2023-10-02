import recipeFactory from '../factories/recipe-factory.js';

const recipesListElt = document.getElementById('recipes-list');

const updateDynamicContent = (recipes) => {
  generateRecipesList(recipes);
  updateRecipesCount(recipes.length);
  generateSelectsLists(recipes);
};

const generateRecipesList = (recipes) => {
  recipesListElt.innerHTML = '';
  recipes.forEach((recipe) => {
    const recipeTemplate = recipeFactory(recipe);
    const recipeElt = recipeTemplate.getRecipeCard();
    recipesListElt.appendChild(recipeElt);
  });
};

const generateSelectsLists = (recipes) => {
  const { ingredients, appliances, ustensils } = recipes?.reduce(
    (prev, curr) => {
      curr.ingredients.forEach((ingredient) => {
        if (!prev.ingredients.includes(ingredient.ingredient)) {
          prev.ingredients.push(ingredient.ingredient);
        }
      });

      curr.ustensils.forEach((ustensil) => {
        if (!prev.ustensils.includes(ustensil)) {
          prev.ustensils.push(ustensil);
        }
      });

      if (!prev.appliances.includes(curr.appliance)) {
        prev.appliances.push(curr.appliance);
      }

      return prev;
    },
    { ingredients: [], appliances: [], ustensils: [] }
  );

  const selectIngredients = document.querySelector('#ingredients-select ul');
  const selectAppliances = document.querySelector('#appliances-select ul');
  const selectUstensils = document.querySelector('#ustensils-select ul');
  createSelectList(selectIngredients, ingredients);
  createSelectList(selectAppliances, appliances);
  createSelectList(selectUstensils, ustensils);
};

const updateRecipesCount = (count) => {
  const countRecipesElt = document.getElementById('count-recipes');
  countRecipesElt.innerText = `${count} ${count >= 1 ? 'recettes' : 'recette'}`;
};

const createSelectList = (ulElt, list) => {
  list.forEach((elt, i) => {
    let classes = 'py-2.5 p-4 hover:bg-yellow-400';
    const value = elt.ingredient ? elt.ingredient : elt;
    if (i === elt.length - 1) {
      classes += 'rounded-b-xl';
    }

    const liElt = document.createElement('li');
    liElt.addEventListener('click', selectElt);
    liElt.className = classes;
    liElt.innerText = value;
    ulElt.appendChild(liElt);
  });
};

const selectElt = (e) => {
  e.stopPropagation();
  console.log(`e.currentTarget`, e.currentTarget);
};

export default {
  updateDynamicContent,
  generateRecipesList,
  updateRecipesCount,
};
