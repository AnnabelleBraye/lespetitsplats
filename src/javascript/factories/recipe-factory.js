const recipeFactory = (recipe) => {
  const getRecipeCard = () => {
    const recipeItemElt = document.createElement('div');
    recipeItemElt.className = 'rounded-3xl shadow-recipe';
    const srcImg = `./src/assets/images/recipes/${recipe.image}`;
    const displayTime = recipe.time;

    recipeItemElt.innerHTML = `
      <div class="relative rounded-t-3xl overflow-hidden">
        <img src="${srcImg}" class="rounded-t-3xl h-64 w-full object-cover">
        ${
          displayTime
            ? `<div class='absolute right-5 top-5 bg-yellow-400 rounded-xl px-3.5 py-1'>
              ${recipe.time}min
            </div>`
            : ''
        }
      </div>
      <div class="px-6 pt-8 pb-16">
        <h2>${recipe.name}</h2>
        <div class="pt-7">
          <div>
            <h3>Recette</h3>
            <p>${recipe.description}</p>
          </div>
          <div class="mt-8">
            <h3>Ingrédients</h3>
            <div class="grid grid-cols-2 gap-5">
              ${createIngredientsList()}
            </div>
          </div>
        </div>
      </div>
    `;

    return recipeItemElt;
  };

  const createIngredientsList = () => {
    let html = '';

    recipe.ingredients.forEach((ingredient) => {
      const displayQty = ingredient.quantity;
      const displayUnit = ingredient.unit;
      const displayQtyAndUnit = !displayQty && !displayUnit;
      html += `
        <div class="flex flex-col">
          <p>${ingredient.ingredient}</p>
            <div>
              ${displayQty ? `<span>${ingredient.quantity}</span>` : ''}
              ${displayUnit ? `<span>${ingredient.unit}</span>` : ''}
              ${displayQtyAndUnit ? '<span>-</span>' : ''}
            </div>
        </div>
      `;
    });
    return html;
  };

  return {
    getRecipeCard,
  };
};
