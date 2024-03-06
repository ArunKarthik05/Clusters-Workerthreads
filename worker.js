const express = require('express');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  // Check if this is the main thread
  if (isMainThread) {
    // Create a new Worker thread
    const worker = new Worker(__filename, { workerData: { num: 10000000 } });

    // Listen for messages from the worker thread
    worker.on('message', result => {
      res.send(`Result: ${result}`);
    });

    // Listen for errors from the worker thread
    worker.on('error', err => {
      console.error(err);
      res.status(500).send('An error occurred');
    });
  } else {
    // This code runs inside the worker thread
    const { num } = workerData;
    const result = performCPUIntensiveTask(num);
    parentPort.postMessage(result);
  }
});

// Function to perform CPU-intensive task
function performCPUIntensiveTask(num) {
  let result = 0;
  for (let i = 0; i < num; i++) {
    result += Math.sqrt(i);
  }
  return result;
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
