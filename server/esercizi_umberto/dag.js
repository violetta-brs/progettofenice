
async function runDAG(graph) {
  const done = new Set();
  const running = {};

  async function runTask(name) {
    if (running[name]) return running[name];

    const { deps, task } = graph[name];

    await Promise.all(deps.map(dep => runTask(dep)));

    running[name] = (async () => {
      console.log(`[START] ${name}`);
      await task();
      console.log(`[END]   ${name}`);
      done.add(name);
    })();

    return running[name];
  }

  await Promise.all(Object.keys(graph).map(runTask));

  console.log("--- DAG Completed ---");
}