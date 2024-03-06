const express = require('express');
const cluster = require('cluster');
const os = require('os');

const app = express();
const port = 3000;

// Fake weather data for demonstration purposes
const weatherData = {
    'london': 'Rainy',
    'new york': 'Sunny',
    'tokyo': 'Cloudy'
};

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < os.cpus().length; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });

    console.log(cluster.workers)
    // Function to gracefully shutdown a worker
    const shutdownWorker = (workerId) => {
        const worker = cluster.workers[workerId];
        if (worker) {
            console.log(`Sending SIGTERM to worker ${worker.process.pid}`);
            worker.send('shutdown');
            worker.disconnect();
        }
    };

    // Gracefully shutdown a worker when receiving a message from it
    cluster.on('message', (worker, message) => {
        if (message === 'shutdown') {
            console.log(`Worker ${worker.process.pid} is gracefully exiting`);
            process.kill(worker.process.pid, 'SIGTERM');
        }
    });
    let i=1;
    // Trigger shutdown of a worker (for demonstration purposes)
    setInterval(() => {
        shutdownWorker( i ); // Change worker ID as needed
        i++;
    }, 5000); // Shutdown after 5 seconds
} else {
    // Worker code
    app.get('/weather', (req, res) => {
        const location = req.query.location.toLowerCase();
        const weather = weatherData[location];
        if (weather) {
            res.send({ location, weather });
        } else {
            res.status(404).send('Location not found');
        }
    });

    const server = app.listen(port, () => {
        console.log(`Worker ${process.pid} started`);
    });

    // Listen for a shutdown message from the master process
    process.on('message', (message) => {
        if (message === 'shutdown') {
            console.log(`Worker ${process.pid} received shutdown signal`);
            server.close(() => {
                console.log(`Worker ${process.pid} gracefully exited`);
                process.exit(0);
            });
        }
    });
}
