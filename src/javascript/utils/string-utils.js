const formatSelectName = (str) => {
  const name = str.trim().toLowerCase();
  return name[0].toUpperCase() + name.slice(1);
};

const trimAndLowerCase = (str) => {
  return str.trim().toLowerCase();
};

export default { formatSelectName, trimAndLowerCase };
