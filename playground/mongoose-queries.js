const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose')
const { Todo } = require('./../server/models/todo')
const { User } = require('./../server/models/user')


//User
//existing id
var id = '5be483f7b41eb245f4a79826'

//Todo
//existing id
//var id = '5be586109275084ef075d84f'

//invalid id
//var id = '5be586109275084ef075d84ff075d84f'

//non existing id
//var id = '6be586109275084ef075d84f'

// if (!ObjectID.isValid(id)) {
//     console.log('id not valid')
// }

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos:', todos)
// })

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo:', todo)
// })

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('id not found')
//     }
//     console.log('Todo by id:', todo)
// }).catch((e) => console.log(e))

User.findById(id).then((user) => {
    if (!user) {
        return console.log(`User with id ${id} not found.`)
    }
    console.log(`User with ${id} found.`)
}).catch((e) => console.log(e))