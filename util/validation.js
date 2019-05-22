
const moment = require('moment');

module.exports = {
    name: () => {
        return (req, res, next) => {
            let { username } = req.body;
            if(username.trim() === '') 
                return res.status(400).type('txt').send('User name is required');  
            else
                next();
        }
    },

    id: () => {
        return (req, res, next) => {
            let userId;
            if (req.method === 'POST') //coming from form
                userId  = req.body.userId;
            else       //coming from API
                userId = req.params.userId;

            if (!userId.match(/^[0-9a-fA-F]{24}$/))  // Not a valid ObjectId
                return res.status(400).type('txt').send('UserId not valid');  
            else    
                next();
        }
    },

    description: () => {
        return (req, res, next) => {
            let { description } = req.body;
            if(description.trim() === '') 
                return res.status(400).type('txt').send('Description is required');  
            else
                next();
        }
    },

    duration: () => {
        return (req, res, next) => {
            let { duration } = req.body;
            if(duration.trim() === '') 
                return res.status(400).type('txt').send('Duration is required');  
            else if (isNaN(parseFloat(duration * 1)))
                return res.status(400).type('txt').send('Duration should be a number in minutes');  
            else if (Number(duration) > 1440)
                return res.status(400).type('txt').send('Duration cannot be more than 1440 (24 hrs)');  
            else
                next();
        }
    },

    date: () => {
        return (req, res, next) => {
            let { date } = req.body;

            if (date !== '' && !moment(date, 'YYYY-MM-DD', true).isValid())
                return res.status(400).type('txt').send('Invalid date. Please provide date in YYYY-MM-DD format');  
            else
                next();
        }
    },

    dateRange: () => {
        return (req, res, next) => {
            let { from, to } = req.params;

            if (from !== undefined && !moment(from, 'YYYY-MM-DD', true).isValid())
                return res.status(400).type('txt').send('Invalid from date. Please provide date in YYYY-MM-DD format');  
            else if (to !== undefined && !moment(to, 'YYYY-MM-DD', true).isValid())
                return res.status(400).type('txt').send('Invalid to date. Please provide date in YYYY-MM-DD format');  
            else if (from !== undefined && to !== undefined && moment(to) < moment(from))
                return res.status(400).type('txt').send('Incorrect date range');  
            else
                next();
        }
    },

    limit: () => {
        return (req, res, next) => {
            let { limit } = req.params;
            if (limit !== undefined && isNaN(parseFloat(limit * 1)))
                return res.status(400).type('txt').send('Limit should be a valid number');  
            if (limit !== undefined && limit < 1)
                return res.status(400).type('txt').send('Limit should be greater than 0');  
            else
                next();
        }
    }
}