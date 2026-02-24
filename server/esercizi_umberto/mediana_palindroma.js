function calculateMedianPalindrome(arr1, arr2) {
  const merged = [...arr1, ...arr2].sort((a, b) => a - b);
  const n = merged.length;

  if (n === 0) return { median: 0, isPalindrome: false };

  let median;
  const mid = Math.floor(n / 2);

  if (n % 2 !== 0) {
    median = merged[mid];
  } else {
    median = (merged[mid - 1] + merged[mid]) / 2;
  }

  const str = Math.abs(median).toString().replace('.', '');
  const isPalindrome = str === [...str].reverse().join('');

  return {
    median,
    isPalindrome,
    sortedArray: merged
  };
}

console.log(calculateMedianPalindrome([1, 3, 5], [2, 4]));
console.log(calculateMedianPalindrome([1, 2], [3, 4]));
console.log(calculateMedianPalindrome([100, 121, 10], [200, 121]));
