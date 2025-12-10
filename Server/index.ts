import express, { Request, Response } from 'express';

const app = express();

// Middleware che intercetta tutte le richieste (qualsiasi metodo e path)
app.use((req: Request, res: Response) => {
  res.status(200).send('Hello World');
});

const PORT: number = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});
