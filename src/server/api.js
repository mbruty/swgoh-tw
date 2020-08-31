const express = require('express');
const app = express();
var cors = require('cors')
var bodyParser = require('body-parser');
const { fetchGuildPlayerData } = require('./fetchData');


// Cors 
//const whitelist = ['http://localhost:5000', 'http://localhost:3000', 'http://bruty.net'];

const corsOptions = {
    origin: (origin, callback)  => {
        callback(null, true)
        // if(whitelist.indexOf(origin) !== -1) {
        //     callback(null,true);
        // }
        // else{
        //     callback('Route not allowed');
        // }
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
app.get('/api', (req, res) => {
    // If the request has two allycodes
    if(req.body.codes && req.body.codes.length === 2){
        let [ guildOne, guildTwo ] = req.body.codes;
        // Get rid of any - in the codes
        guildOne = guildOne.replace(/-/g, "");
        guildTwo = guildTwo.replace(/-/g, "");

        // If each allycode is of the correct length
        if(guildOne.length === 9 && guildTwo.length === 9){
            fetchGuildPlayerData([guildOne, guildTwo])
            .then(players => res.json(players))
            .catch((err) => {
                res.sendStatus(404)
            })
        }
        else{
            res.sendStatus(400)
        }
    } else {
        res.sendStatus(400)
    }
})

  
module.exports = startService;