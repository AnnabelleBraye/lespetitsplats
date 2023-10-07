import mapUtils from '../javascript/utils/map-utils.js';
import storageUtils from '../javascript/utils/storage-utils.js';
import stringUtils from '../javascript/utils/string-utils.js';

/**
 * Open the clicked list and generate her list
 * @param {*} e
 */
const openList = (e) => {
  stopPropagation(e);
  const select = e.currentTarget;
  const selectId = select.id;

  const listbox = select.querySelector('[role="listbox"]');

  if (listbox.classList.contains('hidden')) {
    generateSelectList(selectId);
    closeOthersLists(select.id);
  }

  const ul = listbox.querySelector('ul');
  select.classList.toggle('rounded-b-xl');
  ul.classList.toggle('hidden');
  listbox.classList.toggle('hidden');
};

/**
 * Generate the selected list, depending on recipes-filtered,
 * Or recipes if filtered recipes is empty
 * @param {*} selectId List id (ex: ingredients-list)
 */
const generateSelectList = (selectId) => {
  const recipes = storageUtils.getDataStorage(
    'recipes-filtered',
    storageUtils.getDataStorage('recipes', [])
  );
  const selectTagsList = new Map(
    storageUtils.getDataStorage(`select-tags`, [])
  );

  // Map {[str name, boolean isSelected]}
  const eltsMap = recipes.reduce((prev, curr) => {
    const tags = [...selectTagsList.keys()];
    switch (selectId) {
      case 'ingredients-select':
        curr.ingredients.forEach((elt) => {
          prev = setMapItem(elt.ingredient, prev, tags);
        });
        break;
      case 'appliances-select':
        prev = setMapItem(curr.appliance, prev, tags);
        break;
      case 'ustensils-select':
        curr.ustensils.forEach((elt) => {
          prev = setMapItem(elt, prev, tags);
        });
        break;
    }

    return prev;
  }, new Map());

  const selectElt = document.getElementById(selectId);
  // Update the select list items in storage
  localStorage.setItem(`${selectId}-list`, JSON.stringify([...eltsMap]));
  createListboxElts(selectElt, eltsMap);
};

/**
 * If map doesn't includes elt, add elt in map
 * @param {*} elt
 * @param {*} prev
 * @param {*} tags
 * @returns
 */
const setMapItem = (elt, prev, tags) => {
  const name = stringUtils.formatSelectName(elt);
  if (!prev.has(elt)) {
    prev.set(name, tags.includes(name));
  }
  return prev;
};

/**
 * Create all elements inside listbox (input and ul list) and update select list
 * @param {*} selectElt listbox parent select
 * @param {*} eltsMap Map name / isSelected
 */
const createListboxElts = (selectElt, eltsMap) => {
  const inputElt = selectElt.querySelector('input');
  inputElt.className += ' focus:outline focus:outline-2';
  inputElt.value = '';
  inputElt.selectList = eltsMap;
  inputElt.selectElt = selectElt;
  inputElt.addEventListener('click', stopPropagation, false);
  inputElt.addEventListener('input', filterAndUpdate);
  inputElt.addEventListener('keydown', handleKeyDown);

  const clearInputElt = selectElt.querySelector('div > img');
  clearInputElt.inputElt = inputElt;
  clearInputElt.parentListbox = selectElt;
  clearInputElt.addEventListener('click', clearInputValue, false);

  updateSelectList(selectElt, eltsMap);
};

/**
 * Event on click on input xmark
 * Clear input value on click on xmark and update select list
 * @param {*} e
 */
const clearInputValue = (e) => {
  e.stopPropagation();
  const xmarkImg = e.target;

  xmarkImg.inputElt.value = '';
  updateSelectList(xmarkImg.parentListbox, xmarkImg.inputElt.selectList);
};

/**
 * Event on input when enter a letter
 * Get stored select list and filter her depending on input value
 * Then update the select list
 * @param {*} e
 */
const filterAndUpdate = (e) => {
  const filter = stringUtils.trimAndLowerCase(e.target.value);

  const selectElt = e.target.selectElt;
  const selectList = new Map(
    storageUtils.getDataStorage(`${selectElt.id}-list`, [])
  );
  const filteredMap = mapUtils.filterMap(selectList, filter);
  updateSelectList(selectElt, filteredMap);
};

/**
 * Create ul li list of select items
 * @param {*} selectElt
 * @param {*} eltsMap
 */
const updateSelectList = (selectElt, eltsMap) => {
  const ulElt = selectElt.querySelector('ul');
  ulElt.innerHTML = '';
  eltsMap.forEach((value, key) => {
    let classes =
      'flex justify-between py-2.5 p-4 hover:bg-yellow-400 aria-selected:bg-yellow-400 aria-selected:font-bold focus:outline focus:outline-2';

    const liElt = document.createElement('li');
    liElt.setAttribute('aria-selected', value);
    liElt.tabIndex = 0;
    liElt.textTag = key;
    liElt.selectListId = selectElt.id;
    liElt.addEventListener('click', selectListItem, false);
    liElt.addEventListener('keydown', handleKeyDown, false);
    liElt.className = classes;
    const imgClass = !value ? 'invisible' : '';
    liElt.innerHTML = `
    ${key}
    <img class="${imgClass}" src="./src/assets/svg/xmark-rounded.svg">
    `;
    ulElt.appendChild(liElt);
  });
};

/**
 * Event on click on an item of the select list
 * Add or remove selected classes
 * Update aria-selected and tags in storage
 * @param {*} e
 */
const selectListItem = (e) => {
  e.stopPropagation();
  const liElt = e.currentTarget;
  const selectListId = liElt.selectListId;

  liElt.setAttribute(
    'aria-selected',
    liElt.getAttribute('aria-selected') === 'false' ? 'true' : 'false'
  );

  const imgElt = liElt.querySelector('img');
  imgElt.classList.toggle('invisible');
  storageUtils.updateTagsStorage(selectListId, liElt);
};

/**
 * Close all select lists except list in parameters
 * @param {*} selectId
 */
const closeOthersLists = (selectId) => {
  const othersLists = document.querySelectorAll(
    `[id*="-select"]:not(#${selectId})`
  );

  othersLists.forEach((select) => {
    const listbox = select.querySelector('[role="listbox"]');
    if (!listbox.classList.contains('hidden')) {
      closeList(select);
    }
  });
};

/**
 * Hide select list
 * @param {*} select
 */
const closeList = (select) => {
  const listbox = select.querySelector('[role="listbox"]');
  if (!listbox.classList.contains('hidden')) {
    const ul = listbox.querySelector('ul');
    select.classList.add('rounded-b-xl');
    ul.classList.add('hidden');
    listbox.classList.add('hidden');
  }
};

const stopPropagation = (e) => {
  e.stopPropagation();
};

const handleKeyDown = (e) => {
  const selectElt = e.target.parentElement.parentElement.parentElement;
  const key = e.key;

  if (key === 'Escape') {
    closeList(selectElt);
  } else if (e.target.type !== 'text' && key === 'Enter') {
    selectListItem(e);
    const liElt = e.target.closest('li');
    [...selectElt.querySelectorAll(`li`)]
      .find((elt) => elt.textContent.includes(liElt.innerText))
      .focus();
  }
};

export default { openList, generateSelectList, closeList };
