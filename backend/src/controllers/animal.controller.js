const AnimalModel = require("../models/animal.model");
const path = require("path");

module.exports = {
  async getAllAnimals(req, res) {
    try {
      const animals = await AnimalModel.find();
      res.status(200).json(animals);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getAnimalById(req, res) {
    try {
      const animal = await AnimalModel.findById(req.params.id);
      if (!animal) return res.status(404).json({ message: "Animal not found" });
      res.status(200).json(animal);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async createAnimal(req, res) {
    try {
      const { name, age, hasRestriction, restrictionText, animalType, vaccines } = req.body;
      const file = req.file;

      if (!name) {
        return res.status(400).json({ message: "O campo 'name' é obrigatório." });
      }

      const parsedVaccines = vaccines ? JSON.parse(vaccines) : [];

      const animal = new AnimalModel({
        name,
        age,
        hasRestriction,
        restrictionText,
        animalType,
        vaccines: parsedVaccines,
        image: file ? `/uploads/${file.filename}` : '/uploads/default.jpg'
      });

      await animal.save();
      res.status(201).json(animal);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateAnimal(req, res) {
  try {
    const { name, age, hasRestriction, restrictionText, image, animalType, vaccines } = req.body;
    const file = req.file;

    if (!name) {
      return res.status(400).json({ message: "O campo 'name' é obrigatório." });
    }

    let parsedVaccines = [];
    if (Array.isArray(vaccines)) {
      parsedVaccines = vaccines;
    } else if (typeof vaccines === "string" && vaccines.trim() !== "") {
      try {
        parsedVaccines = JSON.parse(vaccines);
      } catch {
        parsedVaccines = [vaccines];
      }
    }

    const updateData = {
      name,
      age,
      hasRestriction,
      restrictionText,
      animalType,
      vaccines: parsedVaccines,
    };

    if (file) {
      updateData.image = `/uploads/${file.filename}`;
    } else if (!file && (!image || image === "null" || image === "")) {
      updateData.image = '/uploads/default.jpg';
    }

    const updatedAnimal = await AnimalModel.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!updatedAnimal) {
      return res.status(404).json({ message: "Animal not found" });
    }

    res.status(200).json(updatedAnimal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
  },

  async deleteAnimal(req, res) {
    try {
      const animal = await AnimalModel.findByIdAndDelete(req.params.id);
      if (!animal) {
        return res.status(404).json({ message: "Animal not found" });
      }

      return res.status(200).json({ message: "Animal deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }
};
