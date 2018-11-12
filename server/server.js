const _ = require('lodash')
    //library imports
const express = require('express')
const bodyParser = require('body-parser')

//local imports
//use destructuring to create and obtain the variable 'mongoose'
const { ObjectID } = require('mongodb').ObjectID
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

app.patch('/todos/:id', (req, res) => {

    console.log(req.params)
    var id = req.params.id

    var body = _.pick(req.body, ['text', 'completed'])

    if (!ObjectID.isValid(id)) {
        console.log(`Invalid ID: ${id}`)
        return res.status(404).send('Invalid ObjectID')
    }
    console.log(`Valid ID: ${id}`)

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime()
        console.log(`CompletedAt Set`)
    } else {
        body.completedAt = null
        body.completed = false
        console.log(`CompletedAt set to null, Completed set to false`)
    }

    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
        if (!todo) {
            console.log(`Todo not found`)
            return res.sendStatus(400)
        }
        console.log(`Todo Updated`)
        res.send(todo);
    }).catch((err) => {
        console.log(`Error occured: ${err}`)
        res.sendStatus(400)
    })

})


app.listen(port, () => {
    console.log(`Started on port ${port}`)
})


module.exports = { app }