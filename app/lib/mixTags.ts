// This code found in Geeks for Geeks
// https://www.geeksforgeeks.org/combinations-from-n-arrays-picking-one-element-from-each-array/
function mix<T>(tags: Array<Array<T>>): Array<Array<T>> {
  if (tags.length > 0) {
    if (tags[0].length === 0) {
      return [[]];
    }
  }
  const n = tags.length; // number of array to combine
  // to keep track of next element
  // in each of the n arrays
  const indexes: Array<number> = new Array(n).fill(0);
  // to store all the combinations
  const combinations: Array<Array<T>> = [];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const currentCombination: Array<T> = [];
    let i = 0;
    // compute current combination
    for (i = 0; i < n; i += 1) {
      currentCombination.push(tags[i][indexes[i]]);
    }
    // store current combination
    combinations.push(currentCombination);
    // find the rightmost array that has more
    // elements left after the current element
    // in that array
    let next = n - 1;
    while (next >= 0 && indexes[next] + 1 >= tags[next].length) {
      next -= 1;
    }
    // no such array is found so no more combinations left
    if (next < 0) {
      break;
    }
    // if found move to next element in that array
    indexes[next] += 1;
    // for all arrays to the right of this
    // array current index again points to
    // first element
    for (i = next + 1; i < n; i += 1) {
      indexes[i] = 0;
    }
  }
  return combinations;
}

export default mix;
