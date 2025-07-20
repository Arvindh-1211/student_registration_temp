const cluster = require('cluster');
const os = require('os');

// Number of CPU cores
const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log(`Master process ${process.pid} is running`);
  console.log(`Forking ${numCPUs} workers...`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Listen for dying workers
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Starting a new one.`);
    cluster.fork();
  });
} else {
  // Workers can share the TCP connection
  // Start your express app here
  require('./server');
}