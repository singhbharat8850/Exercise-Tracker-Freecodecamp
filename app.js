const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config()
const app = express();

// enable CORS so that the API is remotely testable by FCC 
const cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// Mount the body-parser middleware to get ready for POST Requests
// place it before all the routes !
app.use(bodyParser.urlencoded({extended: false}))

// Serve static assets (CSS)
app.use(express.static(__dirname + "/public"))

// Serve the index.HTML file 
app.get("/", function(req, res) {
        res.sendFile(__dirname + "/views/index.html");
});

//import routes
const exerciseRoutes = require('./routes/exerciseRoutes');  
app.use('/api/exercise', exerciseRoutes);

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'Path Not Found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }

  console.log(errCode + ' ' + errMessage)
  res.status(errCode).type('txt').send(errMessage)
})

//initialize db before starting up the server
const initDb = require("./util/db").initDb;
const getDb = require("./util/db").getDb;
const port = process.env.PORT || 3000;
initDb( (err) => {
    if (err) 
        console.log('Error connecting to DB', err.name + ': ' + err.message);
    else
        app.listen(port, () => console.log("API Up and running on port ", port));
});