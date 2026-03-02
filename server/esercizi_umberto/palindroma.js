const parola = "anna";

const parolaInversa = invertiParola(parola);

if(parola === parolaInversa){
    console.log('la parola è palindroma');
  } else {
    console.log('la parola non è palindroma');
  }
  
function invertiParola(str){
  const strInversa = str.toLowerCase().split('').reverse().join('');  
  return strInversa;
}