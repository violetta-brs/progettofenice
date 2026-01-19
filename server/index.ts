import express, { Request, Response } from 'express';
import { hashPassword, validatePasswordStrength, verifyPassword } from './bcryptUtils';

const app = express();

app.use(express.json());

app.post('/api/register', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username e password sono obbligatori' });
    }

    const validation = validatePasswordStrength(password);
    if (!validation.isValid) {
      return res.status(400).json({ 
        error: 'Password non valida', 
        errors: validation.errors 
      });
    }

    const hashedPassword = await hashPassword(password);

    res.status(201).json({ 
      message: 'Utente registrato con successo',
      username,
      hashedPassword 
    });
  } catch (error) {
    console.error('Errore durante la registrazione:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

app.post('/api/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username e password sono obbligatori' });
    }

    const storedHash = '$2b$10$example.hash.here';

    const isValid = await verifyPassword(password, storedHash);

    if (isValid) {
      res.status(200).json({ 
        message: 'Login effettuato con successo',
        username 
      });
    } else {
      res.status(401).json({ error: 'Credenziali non valide' });
    }
  } catch (error) {
    console.error('Errore durante il login:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

app.post('/api/hash', async (req: Request, res: Response) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password è obbligatoria' });
    }

    const hash = await hashPassword(password);
    res.status(200).json({ hash });
  } catch (error) {
    console.error('Errore durante l\'hashing:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

app.post('/api/verify', async (req: Request, res: Response) => {
  try {
    const { password, hash } = req.body;

    if (!password || !hash) {
      return res.status(400).json({ error: 'Password e hash sono obbligatori' });
    }

    const isValid = await verifyPassword(password, hash);
    res.status(200).json({ isValid });
  } catch (error) {
    console.error('Errore durante la verifica:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

const PORT: number = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});
