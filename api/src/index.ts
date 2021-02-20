const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
require("dotenv").config();
import auth from "./middleware/auth";
import db from "./database/database";
import discord from "./strategies/discord";

db.then(() => {
  console.log("⚡️ connected to mongo");
});

app.use(
  session({
    secret: "random",
    cookie: {
      maxAge: 60000 * 60 * 24,
    },
    saveUninitalized: false,
  })
);

app.use(discord.initialize());
app.use(passport.session());

app.use("/auth", auth);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("⚡️Server started on " + PORT);
});
