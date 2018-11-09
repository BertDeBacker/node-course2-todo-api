//library imports
var express = require('express')
var bodyParser = require('body-parser')

//local imports
//use destructuring to create and obtain the variable 'mongoose'
var { mongoose } = require('./db/mongoose')
var { Todo } = require('./models/todo')
var { User } = require('./models/user')

var app = express()
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc)
    }, (e) => {
        res.status(400).send(e)
    })

    console.log(req.body)
})

app.listen(3001, () => {
    console.log('Started on port 3001')
})

module.exports = { app }