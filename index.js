const express = require('express');
const { Worker, isMainThread, parentPort } = require('worker_threads');
const router = express();
const { connection } = require('./database');
const Electronic = require('./schema');

// Function to execute a query in a worker thread
function executeQuery(query) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./queryWorker.js', { workerData: { query } });

    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

// Route to handle multiple queries
router.get('/multipleQueries', async (req, res) => {
  try {
    const query1Result = await executeQuery('SELECT * FROM electronic WHERE Magnitude = 0');
    const query2Result = await executeQuery('SELECT * FROM electronic WHERE Magnitude = 6');
    
    res.json({ query1Result, query2Result });
  } catch (error) {
    console.error('Error executing queries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT;
router.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});