const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const logController = require('../controllers/logController');
const validate = require('../util/validation');

// API endpoint to create a new user
router.get('/new-user/:username', userController.createNewUser);
// Post form to create a new user
router.post('/new-user', validate.name(), userController.createNewUser);

// API endpoint to get all users
router.get('/users', userController.getUsers);

// Post exercise log through form
router.post('/add', validate.id(), validate.description(), validate.duration(), validate.date(), logController.addExercise);

// API endpoint to get the exercise log for a user //log?{userId}[&from][&to][&limit]
router.get('/log/:userId/:from?/:to?/:limit?', validate.id(), validate.dateRange(), validate.limit(), logController.getExerciseLog);

module.exports = router;