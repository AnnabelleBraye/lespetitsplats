import stringUtils from './string-utils.js';
import recipesUtils from './recipes.js';
import tagFunctions from '../../component/tag.js';

/**
 * Add or remove a tag from tags list in storage
 * @param {*} selectListId
 * @param {*} liElt
 */
const updateTagsStorage = (selectListId, liElt) => {
  let tags = new Map(getDataStorage(`select-tags`, []));

  const name = stringUtils.formatSelectName(liElt.textTag);
  if (liElt.getAttribute('aria-selected') === 'true') {
    tags = tagFunctions.addTag(name, selectListId);
  } else {
    tags = tagFunctions.removeTag(name);
  }
};

/**
 * Update recipes-filtered in storage when adding or removing a tag
 * Check for search-filter or tags to filter recipes
 * Then update dynamic content
 * @param {*} selectListId
 * @param {*} tags
 * @param {*} isAddingTag
 */
const updateRecipesStorage = (selectListId, tags, isAddingTag) => {
  recipesUtils.updateRecipesFilteredBySearchAndAllTags(tags, isAddingTag);

  recipesUtils.updateDynamicContent();
};

/**
 * Get Item 'name' or value if item is undefined
 * @param {*} name
 * @param {*} value
 * @returns
 */
const getDataStorage = (name, value) => {
  return localStorage.getItem(name)
    ? JSON.parse(localStorage.getItem(name))
    : value;
};

/**
 * Update the value of isSelected tag in select list
 * @param {*} selectListId
 * @param {*} textTag
 */
const updateSelectedSelectItemStorage = (selectListId, textTag) => {
  const selectList = new Map(getDataStorage(`${selectListId}-list`, []));
  selectList.set(textTag, selectList.get(textTag) === true ? false : true);
  localStorage.setItem(`${selectListId}-list`, JSON.stringify([...selectList]));
};

export default {
  updateTagsStorage,
  getDataStorage,
  updateSelectedSelectItemStorage,
  updateRecipesStorage,
};
