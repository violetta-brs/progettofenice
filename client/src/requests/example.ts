const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Funzione per ottenere dati dal server usando l'API fetch
 * @returns Promise<string> - La risposta del server come stringa
 */
export async function getSomething(): Promise<string> {
    try {
        console.log("Getting something from the server...");
        const response = await fetch(`${API_URL}/`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.text();
        console.log("Risposta dal server:", data);
        return data;
    } catch (error) {
        console.error("Errore nella richiesta al server:", error);
        throw error;
    }
}