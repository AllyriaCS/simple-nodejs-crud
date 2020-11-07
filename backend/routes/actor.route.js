const express = require("express");
const actorModel = require("../models/actor.model");

const router = express.Router();
const schema = require("../schemas/actor.json");
const validation = require("../middleware/validation.mdw");

router.get("/", async function (req, res) {
  const list = await actorModel.getAll();
  res.json(list);
});

router.get("/:id", async function (req, res) {
  const id = req.params.id || -1;
  const actor = await actorModel.singleById(id);

  if (actor === null) {
    return res.status(204).json({});
  }

  res.json(actor);
});

router.post("/", validation(schema), async function (req, res) {
  const id = await actorModel.add(req.body);
  res.status(201).json({ actor_id: id });
});

router.delete("/:id", async function (req, res) {
  const id = req.params.id || -1;
  const number_of_row_deleted = await actorModel.delete(id);
  if (number_of_row_deleted == null) {
    return res
      .status(204)
      .json({ number_of_row_deleted: number_of_row_deleted });
  }
  res.status(202).json({ number_of_row_deleted: number_of_row_deleted });
});

router.patch("/:id", validation(schema), async function (req, res) {
  const actor_id = req.params.id || -1;
  const actorNewInfo = req.body;
  const number_of_row_updated = await actorModel.update(actor_id, actorNewInfo);
  if (number_of_row_updated == null) {
    return res
      .status(204)
      .json({ number_of_row_updated: number_of_row_updated });
  }
  res.status(200).json({ number_of_row_updated: number_of_row_updated });
});

module.exports = router;
