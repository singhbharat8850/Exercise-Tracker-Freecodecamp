const mongoose = require('mongoose');

// Schema for the db
let UserSchema = new mongoose.Schema({
  userName: {type: String,
              required: true,
              unique: true}
})

//* Model for the schema
let User = mongoose.model('User', UserSchema)

// make this available to the users in our Node applications
module.exports = User;