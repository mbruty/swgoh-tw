// Using insertion sort as it's the fastest for small arrays
// @param data, the array to be sorted
// @param sortFunction, a function that returns a boolean with what to sort on

module.exports = (data, sortFunction) => {
  for (let i = 1; i < data.length; ++i) {
    let j = i;
    while (j > 0 && sortFunction(data[j], data[j - 1])) {
      swap(j, j - 1, data);
      --j;
    }
  }
  return data;
};

const swap = (i, j, array) => {
  const tempItem = array[j];
  array[j] = array[i];
  array[i] = tempItem;
};
