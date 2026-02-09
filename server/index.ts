import express from 'express';

const app = express();

app.use(express.json());

const PORT: number = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});
