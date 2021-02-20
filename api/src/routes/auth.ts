import useAuth from "../middleware/useAuth";

const passport = require("passport");
const router = require("express").Router();

router.get("/", passport.authenticate("discord"));

router.get("/check", useAuth, (req, res) => {
  res.json(req.user);
});

router.get(
  "/redirect",
  passport.authenticate("discord", {
    failureRedirect: "/forbidden",
    successRedirect: "http://localhost:3000/",
  })
);

export default router;
