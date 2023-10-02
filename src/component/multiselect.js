const openList = (e) => {
  // e.stopPropagation();
  const select = e.currentTarget;

  const listbox = select.querySelector('[role="listbox"]');

  const inputElt = listbox.querySelector('input');
  inputElt.addEventListener(
    'click',
    (event) => {
      event.stopPropagation();
    },
    false
  );

  const ul = listbox.querySelector('ul');
  select.classList.toggle('rounded-b-xl');
  ul.classList.toggle('hidden');
  listbox.classList.toggle('hidden');
};

export default openList;
