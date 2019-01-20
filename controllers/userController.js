const User = require('../models/user');
const getDb = require('../util/db').getDb;

module.exports = {
    createNewUser: async (req, res, next) => {
        try{
            let userName;
            if (req.method === 'POST') //coming from form
                userName = req.body.username;
            else       //coming from API
                userName = req.params.username;

            //check for duplicate name (case insensitive)
            let duplicate = await User.findOne({'userName': { $regex : new RegExp(userName, "i") } });
            if (duplicate) 
                res.status(409).type('txt').send('Duplicate User Name, user already exists');  
            //save user
            else {
                let user = new User ({userName: userName.trim()});
                let data = await user.save();
                res.status(201).json({'username': data.userName, '_id': data._id});  //Return the new user in json response
            }
        } catch(err)  {
            next(err);
        }
    },

    getUsers: async (req, res, next) => {
        try{
            let data = await User.find().select('userName _id');
            res.status(200).json(data);
        } catch(err){
            next(err);
        }
    }
}