const UserModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  async getAllUsers(req, res) {
    try {
      const users = await UserModel.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getUserById(req, res) {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async createUser(req, res) {
    try {
      const { name, role, email, password } = req.body;
      const file = req.file;

      if (!name || !role || !email || !password) {
        return res.status(400).json({ message: "Os campos 'name', 'role', 'email' e 'password' são obrigatórios." });
      }

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Já existe um usuário com este e-mail." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new UserModel({
        name,
        role,
        email,
        password: hashedPassword,
        image: file ? `/uploads/${file.filename}` : "/uploads/default.jpg"
      });

      await user.save();
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateUser(req, res) {
  try {
    const { name, role, email, password } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  },


  async deleteUser(req, res) {
    try {
      const user = await UserModel.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email e senha são obrigatórios." });
      }

      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Usuário não encontrado." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Senha incorreta." });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secretkey", { expiresIn: "1d" });

      res.status(200).json({ user, token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async forgotPassword(req, res) {
    res.status(501).json({ message: "Not implemented" });
  },

  async resetPassword(req, res) {
    res.status(501).json({ message: "Not implemented" });
  },

  async renderUsers(req, res) {
    try {
      const users = await UserModel.find();
      res.render("users", { users });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};
