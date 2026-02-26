type TaskFn = () => Promise<void>;

type Node = {
  deps: string[];
  task: TaskFn;
};

type Graph = Record<string, Node>;

async function runDAG(graph: Graph) {
  const done = new Set<string>();
  const running: Record<string, Promise<void> | undefined> = {};

  async function runTask(name: string): Promise<void> {
   
    if (running[name]) return running[name]!;

    const { deps, task } = graph[name];

   
    await Promise.all(deps.map(dep => runTask(dep)));

   
    running[name] = (async () => {
      console.log(`[START] ${name}`);
      await task();
      console.log(`[END]   ${name}`);
      done.add(name);
    })();

    return running[name]!;
  }

  await Promise.all(Object.keys(graph).map(runTask));

  console.log("--- DAG Completed ---");
}

