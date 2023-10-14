import stringUtils from './string-utils.js';

/**
 * Transform a map in array to filter her with a string 'filter'
 * @param {*} map
 * @param {*} filter
 * @returns map
 */
const filterMap = (map, filter) => {
  const filteredList = [];
  for (let i = 0; i < [...map].length; i++) {
    const normalizedName = stringUtils.normalizeNFD(
      stringUtils.trimAndLowerCase([...map][i][0])
    );
    const normalizedFilter = stringUtils.normalizeNFD(
      stringUtils.trimAndLowerCase(filter)
    );

    if (normalizedName.includes(normalizedFilter)) {
      filteredList.push([...map][i]);
    }
  }

  const filteredMap = new Map();
  for (let i = 0; i < filteredList.length; i++) {
    filteredMap.set(filteredList[i][0], filteredList[i][1]);
  }

  return filteredMap;
};

export default { filterMap };
