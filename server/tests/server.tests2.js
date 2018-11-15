process.env.port = 3001
process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'

var { mongoose } = require('./../db/mongoose')
const { Todo } = require('./../models/todo')


function test() {
    console.log('Before try')
    try {
        Todo.remove({}).then(() => {
            console.log('in remove body')
        })
    } catch (error) {
        console.log('error')
    }

    console.log('After try')

}

test()