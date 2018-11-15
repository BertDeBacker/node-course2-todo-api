var mongoose = require('mongoose')

mongoose.Promise = global.Promise
    //var url = 'mongodb://<dbuser>:<dbpassword>@ds157843.mlab.com:57843/heroku_n25q9576'
    //var url = 'mongodb://todos:sterren75@ds157843.mlab.com:57843/heroku_n25q9576' 


console.log('connecting to database in mongoose.js')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp', { useNewUrlParser: true })

module.exports = { mongoose }