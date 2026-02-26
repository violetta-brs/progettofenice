type MedianResult = {
  median: number;
  isPalindrome: boolean;
  sortedArray: number[];
};

function calculateMedianPalindrome(
  arr1: number[],
  arr2: number[]
): MedianResult {
  // 1. Unisco e ordino i numeri
  const sorted: number[] = [...arr1, ...arr2].sort((a, b) => a - b);
  const n: number = sorted.length;

  if (n === 0) {
    return { median: 0, isPalindrome: false, sortedArray: [] };
  }

  // 2. Trovo la mediana
  const mid: number = Math.floor(n / 2);
  const median: number =
    n % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;

  // 3. Controllo se è palindroma
  const str: string = Math.abs(median).toString().replace(".", "");
  const isPalindrome: boolean = str === [...str].reverse().join("");

  return { median, isPalindrome, sortedArray: sorted };
}

// Test
console.log(calculateMedianPalindrome([1, 3, 5], [2, 4]));
console.log(calculateMedianPalindrome([1, 2], [3, 4]));
console.log(calculateMedianPalindrome([100, 121, 10], [200, 121]));
