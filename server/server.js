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
const port = process.env.PORT || 3001
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


app.delete('/todos/:id', (req, res) => {
    //get the id
    var id = req.params.id

    //console.log(`Param id: ${id}`)

    if (!ObjectID.isValid(id)) {
        //console.log('Invalid ObjectID')
        return res.status(404).send('Invalid ObjectID')
    } else {
        //console.log('ID validated successfully')
    }

    Todo.findByIdAndDelete(id).then((todo) => {
            if (!todo) {
                //console.log('Document with object id does not exist.')
                return res.status(404).send('Document with object id does not exist.')
            }
            //console.log({ todo, "status": "deleted" })
            res.status(200).send({ todo, "status": "deleted" })
        })
        .catch((e) => {
            //console.log('Unhandled error occured' + e.message)
            res.status(404).send('Unhandled error occured' + e.message)
        })
})

app.listen(port, () => {
    console.log(`Started on port ${port}`)
})







module.exports = { app }