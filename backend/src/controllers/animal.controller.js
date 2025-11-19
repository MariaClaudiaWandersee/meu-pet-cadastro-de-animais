const AnimalModel = require("../models/animal.model");
const path = require("path");
const messages = require("../messages");

function getMessage(lang = "en", key) {
  return messages[lang]?.[key] || messages["en"][key] || key;
}

function translateAnimal(animal, lang) {
  const obj = animal.toObject();
  obj.sex = messages[lang]?.sex?.[obj.sex] || obj.sex;
  obj.animalType = messages[lang]?.animalType?.[obj.animalType] || obj.animalType;
  return obj;
}

module.exports = {
  async getAllAnimals(req, res) {
    const lang = req.headers["accept-language"] || "en";
    try {
      const animals = await AnimalModel.find();
      const translated = animals.map(a => translateAnimal(a, lang));
      res.status(200).json(translated);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getAnimalById(req, res) {
    const lang = req.headers["accept-language"] || "en";
    try {
      const animal = await AnimalModel.findById(req.params.id);
      if (!animal) 
        return res.status(404).json({ message: getMessage(lang, "animalNotFound") });
      res.status(200).json(translateAnimal(animal, lang));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async createAnimal(req, res) {
    const lang = req.headers["accept-language"] || "en";
    try {
      const { name, age, hasRestriction, restrictionText, animalType, vaccines, sex } = req.body;
      const file = req.file;

      if (!name) {
        return res.status(400).json({ message: getMessage(lang, "nameRequired") });
      }

      const parsedVaccines = vaccines ? JSON.parse(vaccines) : [];

      const animal = new AnimalModel({
        name,
        age,
        hasRestriction,
        restrictionText,
        animalType,
        vaccines: parsedVaccines,
        sex,
        image: file ? `/uploads/${file.filename}` : '/uploads/default.jpg'
      });

      await animal.save();
      res.status(201).json(translateAnimal(animal, lang));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateAnimal(req, res) {
    const lang = req.headers["accept-language"] || "en";
    try {
      const { name, age, hasRestriction, restrictionText, image, animalType, vaccines, sex } = req.body;
      const file = req.file;

      if (!name) {
        return res.status(400).json({ message: getMessage(lang, "nameRequired") });
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
        sex
      };

      if (file) {
        updateData.image = `/uploads/${file.filename}`;
      } else if (!file && (!image || image === "null" || image === "")) {
        updateData.image = '/uploads/default.jpg';
      }

      const updatedAnimal = await AnimalModel.findByIdAndUpdate(req.params.id, updateData, { new: true });

      if (!updatedAnimal) {
        return res.status(404).json({ message: getMessage(lang, "animalNotFound") });
      }

      res.status(200).json(translateAnimal(updatedAnimal, lang));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  async deleteAnimal(req, res) {
    const lang = req.headers["accept-language"] || "en";
    try {
      const animal = await AnimalModel.findByIdAndDelete(req.params.id);
      if (!animal) {
        return res.status(404).json({ message: getMessage(lang, "animalNotFound") });
      }

      return res.status(200).json({ message: getMessage(lang, "animalDeleted") });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }
};
