const db = require("../utils/db");

module.exports = {
  getAll() {
    return db("users");
  },

  async singleById(id) {
    const list = await db("users").where("id", id);
    if (list.length === 0) {
      return null;
    }

    return list[0];
  },

  add(user) {
    return db("users").returning("id").insert(user);
  },

  async delete(id) {
    return await db("users").where("id", id).del();
  },
};
