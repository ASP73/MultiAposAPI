const User = require("../models/users-models");

class UserController {
  async getUsers(req, res) {
    try {
      const users = await User.fetchAll();
      res.json({ users });
    } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await User.fetchById(req.params.user_id);
      if (user) {
        res.json({ user });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  }

  async createUser(req, res) {
    try {
      const newUser = await User.create(req.body);
      res.status(201).json({ user: newUser });
    } catch (err) {
      console.error("Error creating user:", err);
      res.status(500).json({ error: "Failed to create user" });
    }
  }

  async updateUser(req, res) {
    try {
      const user = await User.fetchById(req.params.user_id);
      if (user) {
        const updatedUser = await user.update(req.body);
        res.json({ user: updatedUser });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).json({ error: "Failed to update user" });
    }
  }

  async deleteUser(req, res) {
    try {
      const user = await User.fetchById(req.params.user_id);
      if (user) {
        const deleted = await user.delete();
        if (deleted) {
          res.status(204).send();
        } else {
          res.status(500).json({ error: "Failed to delete user" });
        }
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ error: "Failed to delete user" });
    }
  }
}

module.exports = UserController;
