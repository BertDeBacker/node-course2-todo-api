//library imports
var express = require('express')
var bodyParser = require('body-parser')

//local imports
//use destructuring to create and obtain the variable 'mongoose'
var { ObjectID } = require('mongodb').ObjectID
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

    //console.log(req.body)
})

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos, code: 'success' })
    }, (e) => {
        res.status(400).send(e)
    })
})


app.get('/todos/:id', (req, res) => {
    var id = req.params.id

    //Validate id using isValid
    //404 - send back empty send
    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Invalid id')
    }

    //Lookup by ID
    Todo.findById(id).then((todo) => {
        if (todo) {
            //Found
            res.status(200).send({ todo })
        } else {
            //Not Found
            res.status(404).send({})
        }
    }).catch((e) => res.status(404).send(e))
})

app.listen(3001, () => {
    console.log('Started on port 3001')
})


module.exports = { app }