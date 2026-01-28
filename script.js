// Unicode dei pezzi
const pezzi = {
  "T": "♜","C": "♞","A": "♝","D": "♛","R": "♚","P": "♟",
  "t": "♖","c": "♘","a": "♗","d": "♕","r": "♔","p": "♙"
};

// Scacchiera iniziale
let scacchiera = [
  ["T","C","A","D","R","A","C","T"],
  ["P","P","P","P","P","P","P","P"],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["p","p","p","p","p","p","p","p"],
  ["t","c","a","d","r","a","c","t"]
];

const scacchieraDiv = document.getElementById("scacchiera");
const turnoDiv = document.getElementById("turno");
const messaggioDiv = document.getElementById("messaggio");

let selezionata = null;
let turnoBianco = true;
let mossaEnPassant = null;
let arroccoDisponibile = {
  "Bianco": {K:true,Q:true},
  "Nero": {K:true,Q:true}
};

// Funzione per creare la griglia
function creaScacchiera() {
  scacchieraDiv.innerHTML = "";
  for(let i=0;i<8;i++){
    for(let j=0;j<8;j++){
      const casella = document.createElement("div");
      casella.classList.add("casella");
      casella.classList.add((i+j)%2===0?"bianca":"nera");
      casella.dataset.riga = i;
      casella.dataset.colonna = j;
      casella.innerHTML = pezzi[scacchiera[i][j]] || "";
      casella.addEventListener("click", selezionaCasella);
      scacchieraDiv.appendChild(casella);
    }
  }
  evidenziaScacco();
}

// Funzione click casella
function selezionaCasella(event){
  const riga = parseInt(this.dataset.riga);
  const colonna = parseInt(this.dataset.colonna);

  if(selezionata){
    const possibili = mossePossibili(selezionata.riga,selezionata.colonna,true);
    if(possibili.some(p=>p[0]===riga && p[1]===colonna)){
      muoviPezzo(selezionata.riga,selezionata.colonna,riga,colonna);
      turnoBianco = !turnoBianco;
      turnoDiv.textContent = "Turno: " + (turnoBianco?"Bianco":"Nero");
      selezionata = null;
      creaScacchiera();
      controlloScaccoScaccomatto();
    } else {
      selezionata = null;
      creaScacchiera();
    }
  } else if(scacchiera[riga][colonna]!==""){
    const bianco = scacchiera[riga][colonna]===scacchiera[riga][colonna].toLowerCase();
    if(bianco===turnoBianco){
      selezionata = {riga,colonna};
      evidenziaMosse();
    }
  }
}

// Evidenzia mosse possibili
function evidenziaMosse(){
  creaScacchiera();
  if(!selezionata) return;
  const possibili = mossePossibili(selezionata.riga,selezionata.colonna);
  possibili.forEach(([r,c])=>{
    const idx = r*8+c;
    scacchieraDiv.children[idx].classList.add("possibile");
  });
  const idx = selezionata.riga*8+selezionata.colonna;
  scacchieraDiv.children[idx].classList.add("selezionata");
}

// Funzione per muovere un pezzo (gestisce promozione, en passant e arrocco)
function muoviPezzo(r1,c1,r2,c2){
  const pezzo = scacchiera[r1][c1];
  // Arrocco
  if(pezzo.toLowerCase()==="r" && Math.abs(c2-c1)===2){
    if(c2>c1){ // arrocco corto
      scacchiera[r2][c2-1] = scacchiera[r2][7];
      scacchiera[r2][7] = "";
    } else { // arrocco lungo
      scacchiera[r2][c2+1] = scacchiera[r2][0];
      scacchiera[r2][0] = "";
    }
  }
  // En passant
  if(pezzo.toLowerCase()==="p" && c1!==c2 && scacchiera[r2][c2]===""){
    scacchiera[r1][c2] = "";
  }
  // Promozione
  if(pezzo.toLowerCase()==="p" && (r2===0 || r2===7)){
    scacchiera[r2][c2] = turnoBianco?"d":"D";
  } else {
    scacchiera[r2][c2] = scacchiera[r1][c1];
  }
  scacchiera[r1][c1] = "";
}

// Funzione base mosse possibili (gestisce pezzi principali)
function mossePossibili(riga,colonna,verificaScacco=false){
  const pezzo = scacchiera[riga][colonna];
  const mosse = [];
  if(!pezzo) return mosse;
  const bianco = pezzo===pezzo.toLowerCase();
  if(bianco!==turnoBianco) return mosse;
  const dir = bianco?-1:1;
  switch(pezzo.toLowerCase()){
    case 'p':
      if(scacchiera[riga+dir]?.[colonna]==="") mosse.push([riga+dir,colonna]);
      if(riga=== (bianco?6:1) && scacchiera[riga+dir]?.[colonna]==="" && scacchiera[riga+2*dir]?.[colonna]==="") mosse.push([riga+2*dir,colonna]);
      if(colonna>0 && scacchiera[riga+dir][colonna-1] && scacchiera[riga+dir][colonna-1]!="" && scacchiera[riga+dir][colonna-1].toLowerCase()!==pezzo) mosse.push([riga+dir,colonna-1]);
      if(colonna<7 && scacchiera[riga+dir][colonna+1] && scacchiera[riga+dir][colonna+1]!="" && scacchiera[riga+dir][colonna+1].toLowerCase()!==pezzo) mosse.push([riga+dir,colonna+1]);
      // En passant
      if(mossaEnPassant) mosse.push(mossaEnPassant);
      break;
    case 't':
      for(let d of [[1,0],[-1,0],[0,1],[0,-1]]){
        let x=riga+d[0], y=colonna+d[1];
        while(x>=0 && x<8 && y>=0 && y<8){
          if(scacchiera[x][y]==="") mosse.push([x,y]);
          else {if(scacchiera[x][y].toLowerCase()!==pezzo) mosse.push([x,y]); break;}
          x+=d[0]; y+=d[1];
        }
      } break;
    case 'c':
      for(let m of [[2,1],[1,2],[-1,2],[-2,1],[-2,-1],[-1,-2],[1,-2],[2,-1]]){
        let x=riga+m[0], y=colonna+m[1];
        if(x>=0 && x<8 && y>=0 && y<8 && (scacchiera[x][y]==="" || scacchiera[x][y].toLowerCase()!==pezzo)) mosse.push([x,y]);
      } break;
    case 'a':
      for(let d of [[1,1],[1,-1],[-1,1],[-1,-1]]){
        let x=riga+d[0], y=colonna+d[1];
        while(x>=0 && x<8 && y>=0 && y<8){
          if(scacchiera[x][y]==="") mosse.push([x,y]);
          else {if(scacchiera[x][y].toLowerCase()!==pezzo) mosse.push([x,y]); break;}
          x+=d[0]; y+=d[1];
        }
      } break;
    case 'd':
      for(let d of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){
        let x=riga+d[0], y=colonna+d[1];
        while(x>=0 && x<8 && y>=0 && y<8){
          if(scacchiera[x][y]==="") mosse.push([x,y]);
          else {if(scacchiera[x][y].toLowerCase()!==pezzo) mosse.push([x,y]); break;}
          x+=d[0]; y+=d[1];
        }
      } break;
    case 'r':
      for(let dx=-1;dx<=1;dx++){
        for(let dy=-1;dy<=1;dy++){
          if(dx===0 && dy===0) continue;
          let x=riga+dx, y=colonna+dy;
          if(x>=0 && x<8 && y>=0 && y<8 && (scacchiera[x][y]==="" || scacchiera[x][y].toLowerCase()!==pezzo)) mosse.push([x,y]);
        }
      } break;
  }
  return mosse;
}

// Evidenzia re in scacco
function evidenziaScacco(){
  for(let i=0;i<8;i++){
    for(let j=0;j<8;j++){
      const c = scacchiera[i][j];
      if(c.toLowerCase()==="r"){
        if(reInScacco(i,j)){
          const idx=i*8+j;
          scacchieraDiv.children[idx].classList.add("scacco");
        }
      }
    }
  }
}

// Controllo scacco (semplificato)
function reInScacco(riga,colonna){
  for(let i=0;i<8;i++){
    for(let j=0;j<8;j++){
      const c = scacchiera[i][j];
      if(c && (c.toLowerCase()!==scacchiera[riga][colonna].toLowerCase())){
        const mosse=mossePossibili(i,j,true);
        if(mosse.some(p=>p[0]===riga && p[1]===colonna)) return true;
      }
    }
  }
  return false;
}

// Controllo scacco e scaccomatto
function controlloScaccoScaccomatto(){
  const coloreTurno = turnoBianco?"Bianco":"Nero";
  let re = null;
  for(let i=0;i<8;i++){
    for(let j=0;j<8;j++){
      if(scacchiera[i][j].toLowerCase()==="r" && (scacchiera[i][j]===scacchiera[i][j].toLowerCase())===turnoBianco){
        re=[i,j];
        break;
      }
    }
    if(re) break;
  }
  if(reInScacco(re[0],re[1])){
    messaggioDiv.textContent = "SCACCO!";
  } else {
    messaggioDiv.textContent = "";
  }
}

// Inizializzazione
creaScacchiera();
