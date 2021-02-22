const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require('body-parser');
require("./swgoh-api");
require("dotenv").config();
require("./queue");
require("./bot");
import auth from "./routes/auth";
import db from "./database/database";
import discord from "./strategies/discord";
import useAuth from "./middleware/useAuth";
import me from "./routes/me";
import data from "./routes/data";

db.then(() => {
  console.log("⚡️ connected to mongo");
});

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

app.use(
  session({
    secret: "random",
    cookie: {
      maxAge: 60000 * 60 * 24,
    },
    saveUninitalized: false,
    name: "authorization",
    httpOnly: true,
  })
);

app.use(discord.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use("/auth", auth);
app.use("/me", me);
app.use("/data", data);

app.get("/protected", useAuth, (req, res) => {
  res.json(req.user);
});
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("⚡️Server started on " + PORT);
});
