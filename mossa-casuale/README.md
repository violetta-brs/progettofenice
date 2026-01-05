# Gestione Mosse e Interazioni

Questa cartella contiene la logica per gestire le mosse e le interazioni con la scacchiera.

## File

### `moveHandler.ts`
Gestisce le operazioni base sulle mosse:
- `makeRandomMove()` - Esegue una mossa casuale valida
- `makeMove()` - Esegue una mossa specifica
- `isValidMove()` - Verifica se una mossa è valida
- `getPossibleMoves()` - Ottiene tutte le mosse possibili per una casella
- `getGameStatus()` - Ottiene lo stato del gioco (scacco, scacco matto, ecc.)

### `interactionHandler.ts`
Gestisce le interazioni dell'utente:
- `ChessInteractionHandler` - Classe principale per gestire le interazioni
  - `handleSquareClick()` - Gestisce il click su una casella
  - `makeComputerMove()` - Esegue una mossa del computer
  - `resetGame()` - Resetta il gioco
  - `loadFen()` - Carica una posizione FEN
  - `getState()` - Ottiene lo stato corrente

## Utilizzo

```typescript
import { ChessInteractionHandler } from './mossa-casuale/interactionHandler';

// Crea un handler
const handler = new ChessInteractionHandler(
  undefined, // FEN opzionale
  (state) => {
    // Callback chiamato quando lo stato cambia
    console.log('Stato aggiornato:', state);
  }
);

// Gestisci click su casella
handler.handleSquareClick('e2');

// Esegui mossa del computer
handler.makeComputerMove();

// Ottieni stato
const state = handler.getState();
```

## Dipendenze

- `chess.js` - Libreria per la logica degli scacchi




