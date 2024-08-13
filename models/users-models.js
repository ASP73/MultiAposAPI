const db = require("../db/connection");

class User {
  constructor(data) {
    this.id = data.user_id;
    this.username = data.user_username;
    this.name = data.user_name;
    this.password = data.user_password;
    this.role = data.user_role;
  }

  static async fetchAll() {
    const { rows } = await db.query("SELECT * FROM users");
    return rows.map((row) => new User(row));
  }

  static async fetchById(id) {
    const { rows } = await db.query("SELECT * FROM users WHERE user_id = $1", [
      id,
    ]);
    return rows.length ? new User(rows[0]) : null;
  }

  static async create(userData) {
    const { rows } = await db.query(
      "INSERT INTO users (user_username, user_name, user_password, user_role) VALUES ($1, $2, $3, $4) RETURNING *",
      [userData.username, userData.name, userData.password, userData.role]
    );
    return new User(rows[0]);
  }

  async update(userData) {
    const { rows } = await db.query(
      "UPDATE users SET user_username = $1, user_name = $2, user_password = $3, user_role = $4 WHERE user_id = $5 RETURNING *",
      [
        userData.username,
        userData.name,
        userData.password,
        userData.role,
        this.id,
      ]
    );
    return new User(rows[0]);
  }

  async delete() {
    const { rowCount } = await db.query(
      "DELETE FROM users WHERE user_id = $1",
      [this.id]
    );
    return rowCount > 0;
  }
}

module.exports = User;
