const {login} = require('./server/fetchData');
const startService = require('./server/api');
require('dotenv').config();

const start = () => {

    // Login to swgoh.help api
    const swapi = () => {
        login()
        .then(() => console.log('Logged in to swgoh.help'))
        .catch(err => {
            console.log("Error logging in to swgoh.help: ", err)
            setTimeout(() => {
                console.log("Retrying swgoh.help login...");
                swapi();
            }, 5000)
        });
    }

    const api = () => {
        startService()
        .catch(err => {
            console.error("Error starting api", err);
            setTimeout(() => {
                console.log("Retrying api start...");
                api();
            }, 5000)
        })
    }

    swapi()
    api()
}

//Start services
console.clear();
start();

// Log any unhandled erors
process.on('unhandledRejection', err => {
    console.log(`Unhandled error: ${err}`);
})