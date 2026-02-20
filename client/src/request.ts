const API_URL = process.env.API_URL || 'http://localhost:3000';

async function makeRequest() {
  console.log(`Richiesta al server...`);
  console.log(`URL: ${API_URL}\n`);

  try {
    console.log('1. GET /api/test');
    const response = await fetch(`${API_URL}/`);
    const text = await response.text();
    console.log(`Status: ${response.status}`);
    console.log(`Risposta: ${text}\n`);

    console.log('2. GET /api/test');
    try {
      const testResponse = await fetch(`${API_URL}/api/test`);
      if (testResponse.ok) {
        const data = await testResponse.json();
        console.log(` Status: ${testResponse.status}`);
        console.log(`Risposta:`, data);
      } else {
        console.log(`     Status: ${testResponse.status} - Endpoint non disponibile`);
      }
    } catch (error) {
      console.log(`   Endpoint /api/test non disponibile`);
    }

    console.log('\n Richiesta completata');
  } catch (error) {
    console.error('Errore:', error);
    process.exit(1);
  }
}

makeRequest();

