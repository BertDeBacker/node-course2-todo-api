const { Todo } = require('./../../models/todo')
const { User } = require('./../../models/user')
const { ObjectID } = require('mongodb')
const jwt = require('jsonwebtoken')


const userOneId = new ObjectID()
const userTwoId = new ObjectID()

const users = [{
    _id: userOneId,
    email: 'bert.debacker@hotmail.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneId, access: 'auth' }, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userTwoId,
    email: 'Elke.debacker@hotmail.com',
    password: 'userTwoPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userTwoId, access: 'auth' }, process.env.JWT_SECRET).toString()
    }]
}]

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo',
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333,
    _creator: userTwoId
}];


const populateTodos = (done) => {
    Todo.deleteMany({}).then(() => {
        Todo.insertMany(todos).then(done())
    })
}

// const populatedUsers = (done) => {
//     User.deleteMany({}).then(() => {

//         //save returns a promise
//         var userOne = new User(users[0]).save()
//         var userTwo = new User(users[1]).save()
//         return Promise.all[userOne, userTwo]
//     }).then(() => done())

// }


const populateUsers = (done) => {
    User.remove({}).then(() => {
            var userOne = new User(users[0]).save();
            var userTwo = new User(users[1]).save();

            //Promise.all([userOne, userTwo]).then(() => done())
        }) //.then(() => done());

    setTimeout(done, 1500)
};

module.exports = { todos, populateTodos, users, populateUsers }


//this will be exectue before each test case
//this works, returns one error in test nr 1

// beforeEach((done) => {
//     Todo.deleteMany({}, () => {
//         Todo.insertMany(todos).then(done())
//     })
// })

//this works, returns one error in test nr 1
// beforeEach((done) => {
//     Todo.deleteMany({}).then(() => {
//         Todo.insertMany(todos).then(done())
//     })
// })