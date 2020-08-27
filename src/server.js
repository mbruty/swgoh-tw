const express = require('express');
require('dotenv').config();
const app = express();
var cors = require('cors')
var bodyParser = require('body-parser');
const ApiSwgohHelp = require('api-swgoh-help');
const Cache = require('./server/cache.js');
const codes = [647793576, 711217969 ];

const dataCache = new Cache();

let swapi = undefined;
// API Login
const login = () => {
    swapi = new ApiSwgohHelp({
        "username":process.env.API_UNAME,
        "password":process.env.API_PASSWORD
    });
    return new Promise(async (resolve, reject) => {
        swapi.connect()
        .then(res => resolve(res))
        .catch(err => reject(err));

    })
}

const fetchGuildData = async (allycodes) => {
    const payload = {
        allycodes,
        collection: "guildExchangeItemList"
    }
    let  { result, error, warning }  = await swapi.fetchGuild( payload );

    //Result is an array of guild data
    //Example object returned see guild_sample_result.json
    if(error) {
        console.error(error);
    }
    if(warning) {
        console.warn(warning);
    }
    else{
        dataCache.addGuild(result);
    }
}
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
login()
//Fetch the data for the tracked guilds
.then(() => fetchGuildData(codes))
.catch(err => console.error(err));
const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);