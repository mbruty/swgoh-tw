const express = require('express');
const app = express();
var cors = require('cors')
var bodyParser = require('body-parser');
const { fetchGuildPlayerData } = require('./fetchData');


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

const startService = () => {
    return new Promise((resolve, reject) => {
        try{
            const port = process.env.PORT || 5000;
            app.listen(port);
            console.log('App is listening on port ' + port);
        } catch(err) {
            reject(err);
        }
        resolve();
    })
}

// Routes

// api/guilds/code1&code2&code3...
app.get('/api/guilds/:code', (req, res) => {

    const code = req.params.code.split("&");
    // Every code in the params is of length 9
    if(code.every((value) => value.length === 9)){
        fetchGuildPlayerData(code)
        .then(players => res.json(players))
        .catch((err) => {
            res.status(404).json(err)
        })
    }
    else{
        res.sendStatus(400)
    }
})

  
module.exports = startService;