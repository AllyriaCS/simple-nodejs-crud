const { update } = require("../utils/db");
const db = require("../utils/db");

module.exports = {
  getAll() {
    return db("actor");
  },

  async singleById(id) {
    const list = await db("actor").where("actor_id", id);
    if (list.length === 0) {
      return null;
    }

    return list[0];
  },

  add(actor) {
    return db("actor").returning("actor_id").insert(actor);
  },

  async delete(actor_id) {
    try {
      await db.schema.table("film_actor", function (table) {
        table.dropForeign("actor_id", "fk_film_actor_actor");
      });
    } catch (e) {
      // already delete the foreign relationship
    }
    return await db("actor").where("actor_id", actor_id).del();
  },

  update(actor_id, actorNewInfo) {
    return db("actor").where("actor_id", "=", actor_id).update(actorNewInfo);
  },
};
