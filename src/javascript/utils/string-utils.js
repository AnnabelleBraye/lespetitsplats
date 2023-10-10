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

/**
 * Remove accents and space on a string
 * @param {*} str
 * @returns
 */
const normalizeNFD = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replaceAll("'", ' ');
};

export default { formatSelectName, trimAndLowerCase, normalizeNFD };
