import storageUtils from '../javascript/utils/storage-utils.js';

const tagsList = document.getElementById('tags-list');

/**
 * Create tag element of name 'name' and add removeTagEvent on click on xmark
 * update the recipes-filtered in storage
 * @param {*} name
 */
const createTagElt = (name) => {
  const tags = new Map(storageUtils.getDataStorage(`select-tags`, []));
  const tagElt = document.createElement('div');
  tagElt.className =
    'flex justify-between w-full mt-5 rounded-xl bg-yellow-400 p-4';
  tagElt.innerHTML = `
  <span class="overflow-hidden text-ellipsis whitespace-nowrap">${name}</span>
  <img src="./src/assets/svg/xmark-tag.svg" alt="">
  `;

  const img = tagElt.querySelector('img');
  img.tagNameToRemove = name;
  img.selectListId = tags.get(name);
  img.addEventListener('click', removeTagEvent);
  tagsList.appendChild(tagElt);

  storageUtils.updateRecipesStorage(tags.get(name), tags, true);
};

/**
 * Add a new tag to the list of tags in storage then create them
 * Update the list of selected select item in storage
 * @param {*} name
 * @param {*} selectListId
 * @returns
 */
const addTag = (name, selectListId) => {
  const tags = new Map(storageUtils.getDataStorage(`select-tags`, []));

  tags.set(name, selectListId);

  localStorage.setItem(`select-tags`, JSON.stringify([...tags]));
  storageUtils.updateSelectedSelectItemStorage(selectListId, name);

  createTagElt(name);

  return tags;
};

/**
 * Remove a tag from storage and recreate tags elements
 * @param {*} name
 * @returns
 */
const removeTag = (name) => {
  const tags = new Map(storageUtils.getDataStorage('select-tags', []));
  const selectListId = tags.get(name);
  tags.delete(name);

  tagsList.innerHTML = '';

  localStorage.setItem(`select-tags`, JSON.stringify([...tags]));
  storageUtils.updateSelectedSelectItemStorage(selectListId, name);
  storageUtils.updateRecipesStorage(selectListId, tags, false);

  for (let key of tags.keys()) {
    createTagElt(key);
  }

  return tags;
};

/**
 * Event on click on xmark tag
 * @param {*} e
 */
const removeTagEvent = (e) => {
  const tag = e.target.tagNameToRemove;
  removeTag(tag);
};

export default {
  createTagElt,
  addTag,
  removeTag,
};
