import { strategies } from "../swgoh-api";
import useAuth from "../middleware/useAuth";
import push from "../queue";
const router = require("express").Router();

router.get("/player/:code", useAuth, (req, res) => {
  console.log("Hit end point");
  push(
    { stratergy: strategies.PLAYER_SEARCH, allycode: req.params.code },
    (error: any, result: any) => {
      if(error) {
        res.send(error, 400)
      } else {
        res.json(result)
      }
    }
  );
});

export default router;
