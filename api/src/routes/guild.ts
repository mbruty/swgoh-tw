import useAuth from "../middleware/useAuth";
const Guild = require("../models/guild");
const router = require("express").Router();

router.post("/", useAuth, async (req, res) => {
  console.log(req.user);
  // const newGuild = await Guild.create({

  // });
  // const saved = await newUser.save();
});

export default router;
