const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: String,
  },
  hasRestriction: {
    type: Boolean,
    required: true,
  },
  restrictionText: {
   type: String,
  },
  image: {
    type: String,
    default: '/uploads/default.jpg'
  },
  breed: {
    type: String
  },
  animalType: {
    type: String,
    enum: ["dog", "cat"],
    required: true
  },
  vaccines: {
    type: [String],
    default: []
  },
});

const AnimalModel = mongoose.model("Animal", animalSchema);

module.exports = AnimalModel;