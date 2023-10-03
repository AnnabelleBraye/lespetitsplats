import stringUtils from './string-utils.js';

const filterMap = (map, filter) => {
  const filteredList = [...map].filter((elt) =>
    stringUtils.trimAndLowerCase(elt[0]).includes(filter)
  );

  const filteredMap = new Map();
  filteredList.forEach((elt) => filteredMap.set(elt[0], elt[1]));

  return filteredMap;
};

export default { filterMap };
