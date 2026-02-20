import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use((req: Request, res: Response) => {
  res.status(200).send('Hello World');
});

const PORT: number = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});
