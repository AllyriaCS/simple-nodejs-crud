const express = require("express");
const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const randomToken = require("rand-token");
const router = express.Router();

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

  const refreshToken = randomToken.generate(32);
  await userModel.updateRefreshToken(user.id, refreshToken);

  const accessToken = jwt.sign(
    {
      userId: user.id,
      userName: user.username,
      refreshToken: user.rfToken,
      exp: Math.floor(Date.now() / 1000) + 60,
    },
    "SECRET"
  );

  res.json({
    authenticated: true,
    accessToken,
    refreshToken,
  });
});

/**
 * username
 * refreshToken
 */
router.post("/refresh", async function (req, res) {
  const user = await userModel.singleByUsername(req.body.username);
  if (user == null) {
    return res.json({
      authenticated: false,
    });
  }
  console.log(req.body.refreshToken);
  console.log(user.rfToken);
  if (req.body.refreshToken == user.rfToken) {
    const accessToken = jwt.sign(
      {
        userId: user.id,
        exp: Math.floor(Date.now() / 1000) + 60,
      },
      "SECRET"
    );

    return res.json({
      authenticated: true,
      accessToken,
      refreshToken: user.rfToken,
    });
  }

  res.status(401).json({
    message: "Invalid refresh token",
  });
});

module.exports = router;
