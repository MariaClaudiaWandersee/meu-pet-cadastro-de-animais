const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const animalController = require('../controllers/animal.controller')
const upload = require('../uploads')

function validateObjectId(req, res, next) {
  if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid ID format' })
  }
  next()
}

router.get('/', animalController.getAllAnimals)
router.post('/', upload.single('image'), animalController.createAnimal)
router.get('/:id', validateObjectId, animalController.getAnimalById)
router.put('/:id', upload.single('image'), validateObjectId, animalController.updateAnimal)
router.delete('/:id', validateObjectId, animalController.deleteAnimal)

module.exports = router
