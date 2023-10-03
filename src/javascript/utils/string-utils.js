const formatSelectName = (str) => {
  const ingredient = str.trim().toLowerCase();
  return ingredient[0].toUpperCase() + ingredient.slice(1);
};

const trimAndLowerCase = (str) => {
  return str.trim().toLowerCase();
};

export default { formatSelectName, trimAndLowerCase };
