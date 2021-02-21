require("express");
import e = require("express");
import { CallBack } from "queue";
import handlePlayerSearch from "./handlePlayerSearch";
const fs = require("fs");
const ApiSwgohHelp = require("api-swgoh-help");
require("dotenv").config();
const swapi = new ApiSwgohHelp({
  username: process.env.SWGOH_HELP_UNAME,
  password: process.env.SWGOH_HELP_PASS,
});

swapi
  .connect()
  .then(() => console.log("⚡️ SWAPI Connected"))
  .catch((err) => console.log(err));

export enum strategies {
  PLAYER_SEARCH,
  GUILD_SEARCH,
  GET_GUILD_PLAYERS_FROM_PLAYER,
}

export interface Args {
  stratergy: strategies;
  allycode?: string;
  allycodes?: Array<string>;
}

export const worker = async (args: Args, cb: CallBack) => {
  console.log("worker working");
  switch (args.stratergy) {
    case strategies.PLAYER_SEARCH:
      if (!args.allycode) {
        return null;
      }
      const { result, error, warning } = await handlePlayerSearch(
        swapi,
        args.allycode
      );
      if (result) cb(null, result);
      else {
        const message = error ?? warning;

        console.log(message);
        cb(message, null);
      }
  }
};
