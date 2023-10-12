import stringUtils from './string-utils.js';

/**
 * Transform a map in array to filter her with a string 'filter'
 * @param {*} map
 * @param {*} filter
 * @returns map
 */
const filterMap = (map, filter) => {
  const filteredList = [];
  for (const elt of [...map]) {
    const normalizedName = stringUtils.normalizeNFD(
      stringUtils.trimAndLowerCase(elt[0])
    );
    const normalizedFilter = stringUtils.normalizeNFD(
      stringUtils.trimAndLowerCase(filter)
    );

    if (normalizedName.includes(normalizedFilter)) {
      filteredList.push(elt);
    }
  }

  const filteredMap = new Map();
  for (const elt of filteredList) {
    filteredMap.set(elt[0], elt[1]);
  }

  return filteredMap;
};

export default { filterMap };
