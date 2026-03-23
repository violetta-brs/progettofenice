import { hashPassword, validatePasswordStrength, verifyPassword } from './bcryptUtils';

async function esempioUtilizzo() {
  console.log('=== Esempio di utilizzo bcrypt ===\n');

  console.log('1. Validazione password:');
  const passwordDebole = '12345';
  const validazioneDebole = validatePasswordStrength(passwordDebole);
  console.log(`Password: "${passwordDebole}"`);
  console.log(`Valida: ${validazioneDebole.isValid}`);
  console.log(`Errori: ${validazioneDebole.errors.join(', ')}\n`);

  const passwordForte = 'MyP@ssw0rd123!';
  const validazioneForte = validatePasswordStrength(passwordForte);
  console.log(`Password: "${passwordForte}"`);
  console.log(`Valida: ${validazioneForte.isValid}`);
  console.log(`Errori: ${validazioneForte.errors.join(', ')}\n`);

  console.log('2. Hash di una password:');
  const password = 'MySecureP@ssw0rd!';
  const hash = await hashPassword(password);
  console.log(`Password originale: ${password}`);
  console.log(`Hash generato: ${hash}\n`);

  console.log('3. Verifica password corretta:');
  const isValidCorrect = await verifyPassword(password, hash);
  console.log(`Password: "${password}"`);
  console.log(`Hash: ${hash}`);
  console.log(`Risultato: ${isValidCorrect ? '✓ Password corretta' : '✗ Password errata'}\n`);

  console.log('4. Verifica password errata:');
  const passwordSbagliata = 'WrongPassword123!';
  const isValidWrong = await verifyPassword(passwordSbagliata, hash);
  console.log(`Password: "${passwordSbagliata}"`);
  console.log(`Hash: ${hash}`);
  console.log(`Risultato: ${isValidWrong ? '✓ Password corretta' : '✗ Password errata'}\n`);

  console.log('5. Esempio completo (registrazione -> login):');
  
  const newPassword = 'UserP@ssw0rd2024!';
  const validation = validatePasswordStrength(newPassword);
  
  if (validation.isValid) {
    const userHash = await hashPassword(newPassword);
    console.log(`Registrazione completata. Hash salvato: ${userHash.substring(0, 30)}...`);
    
    const loginPassword = 'UserP@ssw0rd2024!';
    const loginValid = await verifyPassword(loginPassword, userHash);
    
    if (loginValid) {
      console.log('✓ Login effettuato con successo!');
    } else {
      console.log('✗ Password errata');
    }
  } else {
    console.log('Password non valida:', validation.errors);
  }
}

if (require.main === module) {
  esempioUtilizzo().catch(console.error);
}

export { esempioUtilizzo };
