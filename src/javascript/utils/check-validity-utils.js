/**
 * Check if filter contains or not special characters
 * @param {*} filter
 * @returns
 */
const checkFilterValidity = (filter) => {
  const regex = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  return !regex.test(filter);
};

export default checkFilterValidity;
