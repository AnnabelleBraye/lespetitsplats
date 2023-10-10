import mapUtils from '../javascript/utils/map-utils.js';
import storageUtils from '../javascript/utils/storage-utils.js';
import stringUtils from '../javascript/utils/string-utils.js';

/**
 * Open the clicked list and generate her list
 * @param {*} e
 */
const openList = (e) => {
  stopPropagation(e);
  const select = e.currentTarget.id ? e.currentTarget : e.target;
  select.addEventListener('keydown', handleKeydown);
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
  inputElt.addEventListener('keydown', handleKeydown);

  const clearInputElt = selectElt.querySelector('div > img');
  clearInputElt.tabIndex = 0;
  clearInputElt.inputElt = inputElt;
  clearInputElt.parentListbox = selectElt;
  clearInputElt.addEventListener('click', clearInputValue, false);
  clearInputElt.addEventListener('keydown', handleKeydown, false);

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
  const selectElt = e.target.selectElt;
  const selectList = new Map(
    storageUtils.getDataStorage(`${selectElt.id}-list`, [])
  );
  const filteredMap = mapUtils.filterMap(selectList, e.target.value);
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
  if (eltsMap && eltsMap.size > 0) {
    showNoTagElt(selectElt, false);
    eltsMap.forEach((value, key) => {
      let classes =
        'flex justify-between py-2.5 p-4 hover:bg-yellow-400 aria-selected:bg-yellow-400 aria-selected:font-bold focus:outline focus:outline-2 focus:bg-yellow-400';

      const liElt = document.createElement('li');
      liElt.setAttribute('aria-selected', value);
      liElt.tabIndex = 0;
      liElt.textTag = key;
      liElt.selectListId = selectElt.id;
      liElt.addEventListener('click', selectListItem, false);
      liElt.addEventListener('keydown', handleKeydown, false);
      liElt.className = classes;
      const imgClass = !value ? 'invisible' : '';
      liElt.innerHTML = `
        ${key}
        <img class="${imgClass}" src="./src/assets/svg/xmark-rounded.svg">
      `;
      const imgElt = liElt.querySelector('img');
      imgElt.tabIndex = 0;
      ulElt.appendChild(liElt);
    });
  } else {
    showNoTagElt(selectElt, true);
  }
};

const showNoTagElt = (selectElt, show) => {
  const listboxChildren = selectElt.querySelectorAll('div');
  const noTagElt = listboxChildren[listboxChildren.length - 1];
  show ? noTagElt.classList.remove('hidden') : noTagElt.classList.add('hidden');
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
  if (listbox && !listbox.classList.contains('hidden')) {
    const ul = listbox.querySelector('ul');
    select.classList.add('rounded-b-xl');
    ul.classList.add('hidden');
    listbox.classList.add('hidden');
  }
};

const stopPropagation = (e) => {
  e.stopPropagation();
};

const handleKeydown = (e) => {
  const selectElt = e.target.closest('[id*="-select"]');

  const key = e.key;
  const firstElement = selectElt;
  const allChildren = selectElt.querySelectorAll('input, li');
  const firstLi = allChildren.length > 1 ? allChildren[1] : null;
  const lastLi =
    allChildren.length > 1 ? allChildren[allChildren.length - 1] : null;
  const lastElement = allChildren[allChildren.length - 1];

  if (key === 'Escape') {
    e.stopPropagation();
    closeList(selectElt);
    firstElement.focus();
  } else if (e.target.type === 'text') {
    e.stopPropagation();
  } else if (key === 'Enter' && !e.target.id.includes('-select')) {
    e.stopPropagation();
    if (e.target.closest('li')) {
      selectListItem(e);
      const liElt = e.target.closest('li');
      [...selectElt.querySelectorAll(`li`)]
        .find((elt) => elt.textContent.includes(liElt.innerText))
        .focus();
    } else if (e.target.closest('img')) {
      clearInputValue(e);
    }
  } else if (e.target.closest('img') && allChildren.length === 1) {
    if (key === 'Tab') {
      e.preventDefault();
      e.stopPropagation();
      if (e.shiftKey) {
        selectElt.querySelector('input').focus();
      } else {
        selectElt.focus();
      }
    }
  } else if (key === 'Tab' && e.target !== selectElt) {
    e.stopPropagation();
    if (e.shiftKey) {
      if (e.target === firstElement) {
        e.stopPropagation();
        lastElement.focus();
      }
    } else if (e.target === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  } else if (
    key === 'Tab' &&
    e.target === selectElt &&
    !e.target.querySelector('[role=listbox]').classList.contains('hidden')
  ) {
    e.stopPropagation();
    if (e.shiftKey) {
      e.preventDefault();

      if (e.target === firstElement) {
        if (allChildren.length === 1) {
          e.stopPropagation();
          e.target.querySelector('input + div > img').focus();
        } else {
          lastElement.focus();
        }
      }
    }
  } else if (key === 'ArrowDown' && e.target.closest('li')) {
    e.preventDefault();
    e.stopPropagation();
    if (lastLi == e.target.closest('li')) {
      firstLi.focus();
    } else {
      e.target.nextSibling.focus();
    }
  } else if (key === 'ArrowUp' && e.target.closest('li')) {
    e.preventDefault();
    e.stopPropagation();
    if (firstLi === e.target.closest('li')) {
      lastLi.focus();
    } else {
      e.target.previousSibling.focus();
    }
  }
};

export default { openList, generateSelectList, closeList };
