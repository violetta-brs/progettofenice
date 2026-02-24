/**
 * Calculates the median of two arrays and checks if the median is a palindrome.
 */
function calculateMedianPalindrome(arr1, arr2) {
  // 1. Merge and sort numbers
  const merged = [...arr1, ...arr2].sort((a, b) => a - b);
  const n = merged.length;

  if (n === 0) return { median: 0, isPalindrome: false };

  // 2. Compute median
  let median;
  const mid = Math.floor(n / 2);

  if (n % 2 !== 0) {
    median = merged[mid]; // odd length → middle value
  } else {
    median = (merged[mid - 1] + merged[mid]) / 2; // even → average
  }

  // 3. Check if median is a palindrome
  const str = Math.abs(median).toString().replace('.', '');
  const isPalindrome = str === [...str].reverse().join('');

  return {
    median,
    isPalindrome,
    sortedArray: merged
  };
}

// --- EXAMPLES ---

console.log(calculateMedianPalindrome([1, 3, 5], [2, 4]));
// { median: 3, isPalindrome: true }

console.log(calculateMedianPalindrome([1, 2], [3, 4]));
// { median: 2.5, isPalindrome: false }

console.log(calculateMedianPalindrome([100, 121, 10], [200, 121]));
// { median: 121, isPalindrome: true }
