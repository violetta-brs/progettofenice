const express = require('express');
const app = express();

// Middleware che intercetta tutte le richieste (qualsiasi metodo e path)
app.use((req, res) => {
  res.status(200).send('Hello World');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});
