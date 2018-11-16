"use strict"
require('./config/config.js')

//library imports
const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')

//local imports
//use destructuring to create and obtain the variable 'mongoose'
const { ObjectID } = require('mongodb').ObjectID
var { mongoose } = require('./db/mongoose')
var { Todo } = require('./models/todo')
var { User } = require('./models/user')
var { authenticate } = require('./middelware/authenticate')

var app = express()
const port = process.env.PORT || 3001
app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc)
    }, (e) => {
        res.status(400).send(e)
    })

    //console.log(req.body)
})

app.get('/todos', authenticate, (req, res) => {
    Todo.find({ _creator: req.user._id }).then((todos) => {
        res.send({ todos, code: 'success' })
    }, (e) => {
        res.status(400).send(e)
    })
})

app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id

    //Validate id using isValid
    //404 - send back empty send
    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Invalid id')
    }

    //Lookup by ID
    Todo.findOne({ _id: id, _creator: req.user._id.toString() }).then((todo) => {
        if (todo) {
            //Found
            res.status(200).send({ todo })
        } else {
            //Not Found
            res.status(404).send({})
        }
    }).catch((e) => res.status(404).send(e))
})

app.delete('/todos/:id', authenticate, (req, res) => {
    //get the id
    var id = req.params.id

    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Invalid ObjectID')
    }

    Todo.findOneAndDelete({ _id: id, _creator: req.user._id.toHexString() }).then((todo) => {
            if (!todo) {
                return res.status(404).send('Document with object id does not exist.')
            }
            res.status(200).send({ todo, "status": "deleted" })
        })
        .catch((e) => {
            res.status(404).send('Unhandled error occured' + e.message)
        })
})

app.patch('/todos/:id', authenticate, (req, res) => {

    var id = req.params.id

    var body = _.pick(req.body, ['text', 'completed'])

    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Invalid ObjectID')
    }
    //console.log(`Valid ID: ${id}`)

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime()
            //console.log(`CompletedAt Set`)
    } else {
        body.completedAt = null
        body.completed = false
            //console.log(`CompletedAt set to null, Completed set to false`)
    }

    Todo.findOneAndUpdate({ _id: id, _creator: req.user._id }, { $set: body }, { new: true }).then((todo) => {
        if (!todo) {
            //console.log(`Todo not found`)
            return res.sendStatus(400)
        }
        //console.log(`Todo Updated`)
        res.send(todo);
    }).catch((err) => {
        //console.log(`Error occured: ${err}`)
        res.sendStatus(400)
    })

})

app.post('/users', (req, res) => {

    var o = _.pick(req.body, ['email', 'password'])

    var oUser = new User({ 'email': o.email, 'password': o.password })

    oUser.save().then(() => {
            return oUser.generateAuthToken()
        }).then((token) => {
            res.header('x-auth', token).send(oUser)
        })
        .catch((e) => {
            res.status(400).send(e)
        })
})


app.get('/user/me', authenticate, (req, res) => {
    res.send(req.user)
})

//POST /users/login {email,password}
app.post('/users/login', (req, res) => {

    var body = _.pick(req.body, ['email', 'password'])

    User.findByCredentials(body.email, body.password).then((user) => {
        //res.send({ user })
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        })
    }).catch((e) => {
        res.sendStatus(400)
    })

})

app.get('/users', authenticate, (req, res) => {
    User.find().then((users) => {
        res.send({ users, code: 'success' })
    }, (e) => {
        res.status(400).send(e)
    })
})


app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.sendStatus(200)
    }, () => {
        res.sendStatus(400)
    })
})


app.listen(port, () => {
    console.log(`Started on port ${port}`)
})



module.exports = { app }