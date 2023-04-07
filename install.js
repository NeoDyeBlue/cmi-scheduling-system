const Service = require('node-windows').Service;
const path = require('path');

// Create a new service object
const svc = new Service({
  name: 'MongoDB',
  description: 'The MongoDB Server',
  script: path.join(__dirname, 'installer/mongodb.msi'),
  env: {
    NODE_ENV: 'production'
  }
});

// Install the service
svc.install();