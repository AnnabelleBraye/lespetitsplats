import stringUtils from './string-utils.js';

/**
 * Transform a map in array to filter her with a string 'filter'
 * @param {*} map
 * @param {*} filter
 * @returns map
 */
const filterMap = (map, filter) => {
  const filteredList = [...map].filter((elt) => {
    const normalizedName = stringUtils.trimAndLowerCase(
      stringUtils.normalizeNFD(elt[0])
    );
    const normalizedFilter = stringUtils.trimAndLowerCase(
      stringUtils.normalizeNFD(filter)
    );
    return normalizedName.includes(normalizedFilter);
  });

  const filteredMap = new Map();
  filteredList.forEach((elt) => filteredMap.set(elt[0], elt[1]));

  return filteredMap;
};

export default { filterMap };
