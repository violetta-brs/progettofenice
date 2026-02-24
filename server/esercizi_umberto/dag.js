async function runDAG(graph) {
  const done = new Set();          // Task completati
  const running = {};              // Task già avviati (evita doppie esecuzioni)

  async function runTask(name) {
    // Se il task è già in esecuzione → restituisco la stessa promessa
    if (running[name]) return running[name];

    const { deps, task } = graph[name];

    // 1. Aspetto tutte le dipendenze (in parallelo)
    await Promise.all(deps.map(dep => runTask(dep)));

    // 2. Eseguo il task vero e proprio
    running[name] = (async () => {
      console.log(`[START] ${name}`);
      await task();
      console.log(`[END]   ${name}`);
      done.add(name);
    })();

    return running[name];
  }

  // Avvio tutti i task del grafo
  await Promise.all(Object.keys(graph).map(runTask));

  console.log("--- DAG Completed ---");
}
