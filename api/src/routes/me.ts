import useAuth from "../middleware/useAuth";
const User = require("../models/user");
const passport = require("passport");
const router = require("express").Router();

router.get("/icon", useAuth, (req, res) => {
  res.json(
    `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatarUri}.png?size=64`
  );
});

router.get("/allycode", useAuth, (req, res) => {
  if (req.user) {
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

router.put("/allycode", useAuth, (req, res) => {
  const allycode = req.body.code.replace(/\-/g, "");
  User.findByIdAndUpdate(req.user._id, { allycode: allycode }, (err, docs) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

export default router;
