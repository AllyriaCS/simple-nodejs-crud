const db = require("../utils/db");

module.exports = {
  async singleById(id) {
    const list = await db("users").where("id", id);
    if (list.length === 0) {
      return null;
    }

    return list[0];
  },

  async singleByUsername(username) {
    const list = await db("users").where("username", username);
    if (list.length === 0) {
      return null;
    }

    return list[0];
  },

  add(user) {
    return db("users").returning("id").insert(user);
  },

  async updateRefreshToken(id, refreshToken) {
    return db("users").where("id", id).update({ rfToken: refreshToken });
  },

  async isRefreshTokenExisted(id, refreshToken) {
    const list = await db("users")
      .where("id", id)
      .andWhere("rfToken", refreshToken);

    if (list.length > 0) return true;

    return false;
  },
};
