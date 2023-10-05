/**
 * Format string, put first letter on caps
 * @param {*} str
 * @returns
 */
const formatSelectName = (str) => {
  const name = str.trim().toLowerCase();
  return name[0].toUpperCase() + name.slice(1);
};

/**
 * Trim a string and put it in lower case
 * @param {*} str
 * @returns
 */
const trimAndLowerCase = (str) => {
  return str.trim().toLowerCase();
};

export default { formatSelectName, trimAndLowerCase };
