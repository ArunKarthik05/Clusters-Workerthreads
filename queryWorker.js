const { workerData, parentPort } = require('worker_threads');
const { connection } = require('./database');

// Establish a database connection in the worker thread
const pool = connection.promise();

// Execute the query received from the main thread
pool.query(workerData.query)
  .then(([rows, fields]) => {
    parentPort.postMessage(rows); // Send the query result back to the main thread
  })
  .catch((error) => {
    console.error('Error executing query in worker thread:', error);
    process.exit(1); // Exit the worker thread with an error code
  });
