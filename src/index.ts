import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();

// Configurazione CORS per permettere richieste dal client
app.use(cors());

// Middleware per parsing JSON (se necessario per POST/PUT)
app.use(express.json());

// Middleware che intercetta tutte le richieste (qualsiasi metodo e path)
app.use((req: Request, res: Response) => {
  res.status(200).send('Hello World');
});

const PORT: number = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});
