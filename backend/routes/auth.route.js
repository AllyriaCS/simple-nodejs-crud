const express = require("express");
const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const schema = require("../schemas/user.json");
const validation = require("../middleware/validation.mdw");

router.post("/", async function (req, res) {
  const user = await userModel.singleByUsername(req.body.username);
  if (user == null) {
    return res.json({
      authenticated: false,
    });
  }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.json({
      authenticated: false,
    });
  }

  const accessToken = jwt.sign(
    {
      userId: user.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    "caominhduc123"
  );

  res.json({
    authenticated: true,
    accessToken,
  });
});

module.exports = router;
