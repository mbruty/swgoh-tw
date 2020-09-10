const express = require("express");
const app = express();
var cors = require("cors");
const path = require("path");
var bodyParser = require("body-parser");
const { fetchGuildPlayerData } = require("./fetchData");
const io = require('socket.io')();
io.listen(4000);

// Cors
const whitelist = [
  "http://localhost:5000",
  "http://localhost:3000",
  "http://bruty.net",
];

const corsOptions = {
  origin: (origin, callback) => {
    return callback(null, true);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback("Route not allowed");
    }
  },
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(bodyParser.json());
app.use(cors(corsOptions));

const startService = () => {
  return new Promise((resolve, reject) => {
    try {
      console.log(path.join(__dirname, "../../build"));
      const port = process.env.PORT || 5000;
      app.use(express.static(path.join(__dirname, "../../build")));
      app.listen(port);
      console.log("App is listening on port " + port);
    } catch (err) {
      reject(err);
    }
    resolve();
  });
};

io.sockets.on("connection", socket => {
  socket.on("getGuild", codes => {
    fetchGuildPlayerData([codes], socket)
    .then(data => socket.emit('fetched', data[0]))
  })
});

module.exports = startService;
