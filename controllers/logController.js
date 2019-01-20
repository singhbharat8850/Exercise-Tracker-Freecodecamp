const getDb = require('../util/db').getDb;
const User = require('../models/user');
const Exercise = require('../models/exercise');
const moment = require('moment');

module.exports = {
    addExercise: async (req, res, next) => {
        try {
            let { userId } = req.body;
            
            //find user 
            let user = await User.findById(userId).select('userName _id');
            if (!user) 
                res.status(404).type('txt').send('User not found');  

            //save exercise
            let exercise = new Exercise(req.body);
            if (exercise.date === null) {  //if date not provided, get current date
                exercise.date = new Date();
                exercise.date.setHours(0, 0, 0, 0);
            }
            let data = await exercise.save();
            res.status(201).json({'username': user.userName, '_id': user._id, 
                            'description': data.description, 'duration': data.duration, 'date': moment.utc(data.date).format('YYYY-MM-DD')});
        } catch(err) {
            next(err);
        }
    },

    getExerciseLog: async (req, res, next) => {
        try{
            let { userId, from, to, limit } = req.params;

            //find user 
            let user = await User.findById(userId).select('userName _id');
            if (!user) 
                res.status(404).type('txt').send('User not found');  
            
            //Build up query to get the exercise log
            const query = {'userId': userId};
            if (from !== undefined && to !== undefined) 
                query.date = { $gte: moment.utc(from), $lt: moment.utc(to).add(1, 'd') };
            else if (from !== undefined) 
                query.date = { $gte: moment.utc(from)};
            else if (to !== undefined) 
                query.date = { $lt: moment.utc(to).add(1, 'd')};
            
            const queryString = Exercise.find(query).sort('date');
            if (limit !== undefined) 
                queryString.limit(Number(limit));

            queryString.select('-_id description duration date');

            let log = await queryString.exec();
            if (log.length === 0)
                res.status(404).type('txt').send('No exercise log found for user \"' + user.userName + '\"');
            else
                res.status(200).json({'username': user.userName, '_id': user._id, 'count': log.length,'log': log});
            
        } catch(err) {
            next(err);
        }
    }
}