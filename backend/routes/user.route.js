const express = require("express");
const userModel = require("../models/user.model");
var bcrypt = require("bcryptjs");

const router = express.Router();
const schema = require("../schemas/user.json");
const validation = require("../middleware/validation.mdw");

router.post("/", validation(schema), async function (req, res) {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 10);

  const id = await userModel.add(user);
  res.status(201).json(user);
});

module.exports = router;
