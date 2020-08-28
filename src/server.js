const express = require('express');
const start = require('./server/fetchData');
require('dotenv').config();
const app = express();
var cors = require('cors')
var bodyParser = require('body-parser');
// Cors 

const whitelist = ['http://localhost:5000', 'http://localhost:3000', 'http://bruty.net'];

const corsOptions = {
    origin: (origin, callback)  => {
        if(whitelist.indexOf(origin) !== -1) {
            callback(null,true);
        }
        else{
            callback('Route not allowed');
        }
    },
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(bodyParser.json());
app.use(cors(corsOptions));

// Routes
app.get('/:id', (req, res) => {
    const id = req.params.id;
})

//Start services
console.clear();
start();
const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);

// Log any unhandled erors
process.on('unhandledRejection', err => {
    console.log(`Unhandled error: ${err}`);
})