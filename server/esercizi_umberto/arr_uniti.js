let arr = ["1", "2", "3", "4", "9", "11"];
const numero = [ "5", "11", "35", "10"];
const unito = arr.concat (numero)

// mediana //
unito.sort((a, b) => a - b);
const n = unito.length;

if (n === 0) return "arr vuoto"

if (n % 2 === 0) {

    return (unito[n / 2 - 1] + unito[n / 2]) / 2;

     console.log(mediana (pari));
} else {

    return unito[Math.floor(n / 2)];

  console.log(mediana(dispari));
}
console.log (mediana);
