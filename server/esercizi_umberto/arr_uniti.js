let arr = ["1", "2", "3", "4", "9", "11"];
const numero = ["5", "11", "35", "10"];

const unito = arr.concat(numero).map(Number);

// ordino numericamente
unito.sort((a, b) => a - b);

const n = unito.length;

let mediana;

if (n === 0) {
  mediana = "array vuoto";
} else if (n % 2 === 0) {
  mediana = (unito[n / 2 - 1] + unito[n / 2]) / 2;
} else {
  mediana = unito[Math.floor(n / 2)];
}

console.log("Mediana:", mediana);
