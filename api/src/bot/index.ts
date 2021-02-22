import setNotificatoin from "./commands/setNotification";

const Discord = require("discord.js");
require("dotenv").config();
require("../models/user");
const UserModel = require("../models/user");
const GuildModel = require("../models/guild");

const client = new Discord.Client();
const prefix = "tw-";

client.on("ready", () => {
  console.log(`⚡️ Powering up ${client.user.tag}`);
});

client.on("message", async (message) => {
  if (message.content.startsWith(prefix)) {
    const args = message.content.substring(prefix.length).split(" ");
    switch (args[0]) {
      case "notifications":
        setNotificatoin(message, UserModel, GuildModel);
        break;
    }
  }
});

client.login(process.env.DISCORD_SECRET);
