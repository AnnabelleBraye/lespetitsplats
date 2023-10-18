import searchbar from '../component/search-bar.js';

// const testAlgo = () => {
//   let start = 0;
//   let duration = 0;
//   for (let i = 0; i < 100; i++) {
//     start = performance.now();
//     searchbar.filterList('lai');
//     duration += performance.now() - start;
//   }
//   console.log(`duration`, duration);
// };

const testAlgo = async () => {
  let start = 0;
  let duration = 0;

  for (let i = 0; i < 10000; i++) {
    start = performance.now();
    searchbar.filterList('lai');
    duration += performance.now() - start;

    if (i % 100 === 0) {
      await new Promise((resolve) => {
        setTimeout(resolve, 10);
      });
      console.log(`duration à ${i}`, duration);
    }
  }
  console.log('duration', duration);
};

export default testAlgo;
