const updateTagsStorage = (liElt) => {
  const tagsStorage = localStorage.getItem('tags')
    ? JSON.parse(localStorage.getItem('tags'))
    : [];

  if (liElt.getAttribute('aria-selected') === 'true') {
    tagsStorage.push(liElt.textTag);
  } else {
    tagsStorage.splice(
      tagsStorage.findIndex((tag) => tag === liElt.textTag),
      1
    );
  }

  localStorage.setItem('tags', JSON.stringify(tagsStorage));
};

const getStorageData = (name, value) => {
  return localStorage.getItem(name)
    ? JSON.parse(localStorage.getItem(name))
    : value;
};

export default { updateTagsStorage, getStorageData };
