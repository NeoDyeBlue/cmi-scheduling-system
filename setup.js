const { exec } = require('child_process');
const { existsSync } = require('fs');
const path = require('path');

exec('npm install mongodb', (error, stdout, stderr) => {
  if (error) {
    console.log(`Error installing MongoDB: ${error}`);
    return;
  }
  // start Mongodb

  exec(
    'mongodb --config "C:\\Program Files\\MongoDB\\Server\\5.1.0\\bin\\mongod.cfg" --install',
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting MongoDB: ${error}`);
        return;
      }
      console.log(`MongoDB has been installed and started successfully.`);
    }
  );
});


export function execSetup() {
  exec('node setup.js', (error, stdout, stderr) => {
    if (error) {
      console.log(`Error running MongoDB setup script: ${error}`);
      return;
    }
    console.log(stdout);
  });
}
