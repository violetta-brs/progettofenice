/**
 * Esempio di utilizzo delle utility bcrypt
 * 
 * Questo file mostra come utilizzare le funzioni di hash e verifica password
 */

import { hashPassword, verifyPassword, validatePasswordStrength } from './bcryptUtils';

async function esempioUtilizzo() {
  console.log('=== Esempio di utilizzo bcrypt ===\n');

  // 1. Validazione della password
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

  // 2. Hash di una password
  console.log('2. Hash di una password:');
  const password = 'MySecureP@ssw0rd!';
  const hash = await hashPassword(password);
  console.log(`Password originale: ${password}`);
  console.log(`Hash generato: ${hash}\n`);

  // 3. Verifica di una password corretta
  console.log('3. Verifica password corretta:');
  const isValidCorrect = await verifyPassword(password, hash);
  console.log(`Password: "${password}"`);
  console.log(`Hash: ${hash}`);
  console.log(`Risultato: ${isValidCorrect ? '✓ Password corretta' : '✗ Password errata'}\n`);

  // 4. Verifica di una password errata
  console.log('4. Verifica password errata:');
  const passwordSbagliata = 'WrongPassword123!';
  const isValidWrong = await verifyPassword(passwordSbagliata, hash);
  console.log(`Password: "${passwordSbagliata}"`);
  console.log(`Hash: ${hash}`);
  console.log(`Risultato: ${isValidWrong ? '✓ Password corretta' : '✗ Password errata'}\n`);

  // 5. Esempio completo: registrazione e login
  console.log('5. Esempio completo (registrazione -> login):');
  
  // Simulazione registrazione
  const newPassword = 'UserP@ssw0rd2024!';
  const validation = validatePasswordStrength(newPassword);
  
  if (validation.isValid) {
    const userHash = await hashPassword(newPassword);
    console.log(`Registrazione completata. Hash salvato: ${userHash.substring(0, 30)}...`);
    
    // Simulazione login
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

// Esegui l'esempio se il file viene eseguito direttamente
if (require.main === module) {
  esempioUtilizzo().catch(console.error);
}

export { esempioUtilizzo };
