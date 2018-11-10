const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose')

const { Todo } = require('./../server/models/todo')
const { User } = require('./../server/models/user')

//Todo.remove
// Todo.remove({}).then((result) => {
//     console.log(result)
// })

//Todo.findOneAndRemove()

Todo.findByIdAndDelete('5be6ceb2a38a4106a82ef826').then((todo) => {
    console.log(todo);
})

Todo.findOneAndDelete('5be6ceb2a38a4106a82ef826').then((todo) => {
    console.log(todo);
})