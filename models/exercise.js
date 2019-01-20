const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for the db
let ExerciseSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date }
});

//* Model for the schema
let Exercise = mongoose.model('Exercise', ExerciseSchema);

// make this available to the users in our Node applications
module.exports = Exercise;