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
      exp: Math.floor(Date.now() / 1000) + 30,
    },
    "SECRET"
  );

  res.cookie("refreshToken", refreshToken);

  res.json({
    authenticated: true,
    accessToken,
    refreshToken,
  });
});

router.post("/refresh", async function (req, res) {
  const payload = jwt.verify(req.body.accessToken, "SECRET", {
    ignoreExpiration: true,
  });
  const refreshToken = req.body.refreshToken;
  const ret = await userModel.isRefreshTokenExisted(
    payload.userId,
    refreshToken
  );
  if (ret === true) {
    const accessToken = jwt.sign(
      {
        userId: payload.userId,
      },
      "SECRET",
      {
        expiresIn: Math.floor(Date.now() / 1000) + 600,
      }
    );

    return res.json({ accessToken });
  }

  res.status(400).json({
    message: "Invalid refresh token.",
  });
});

module.exports = router;
