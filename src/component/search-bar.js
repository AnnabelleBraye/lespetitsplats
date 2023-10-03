import recipesUtils from '../javascript/utils/recipes.js';

const filterList = (event) => {
  const filter = event.target.value.toLowerCase();
  const listToFilter = JSON.parse(localStorage.getItem('recipes'));
  let filteredList = [];

  if (filter.length >= 3) {
    filteredList = listToFilter.filter((elt) =>
      filterByNameDescIngredient(elt, filter)
    );
  } else {
    filteredList = listToFilter;
  }

  recipesUtils.updateDynamicContent(filteredList);
};

const filterByNameDescIngredient = (elt, filter) => {
  return (
    elt.name.toLowerCase().includes(filter) ||
    elt.description.toLowerCase().includes(filter) ||
    elt.ingredients.some((el) => el.ingredient.toLowerCase().includes(filter))
  );
};

export default filterList;
