const expect = require('expect')
const request = require('supertest')
const { ObjectID } = require('mongodb')

const { app } = require('./../server')
const { Todo } = require('./../models/todo')

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo'
}]


//this will be exectue before each test case
beforeEach((done) => {
    //this will delete all todos in the database and insert the 2 records with insertMany
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done())
})

describe('POST /todos', () => {
    //this is a assynchronous test, done needs to be specified otherwise it will not work
    it('should creata a new todo', (done) => {
        var text = 'DGB website bouwen'

        request(app)
            //do the POST
            .post('/todos')
            //send the data
            .send({ text })
            //start testing - we expect a success return value 200
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    //we add return here so that the function stops exection
                    return done(err)
                }
                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1)
                    expect(todos[0].text).toBe(text)
                    done();
                }).catch((e) => done(e))
            })
    })

    it('should not create a todo without text', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2)
                    done()
                }).catch((e) => done(e))
            })
    })
})

describe('GET /todos', () => {
    it('Should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done)
    })
})


describe('GET /todos/:id', () => {

    it('should return todo doc', (done) => {

        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done)

    })

    it('should return a 404 if todo not found', (done) => {
        //make sure you get a 404 back
        request(app)
            .get(`/todos/${new ObjectID}`)
            .expect(404)
            .end(done);
    })

    it('should return 404 for non-object ids', (done) => {
        request(app)
            .get(`/todos/2133215`)
            .expect(404)
            .end(done);
    })

})

describe('DELETE /todos/:id', () => {

    it('Should remove a todo', (done) => {
        var _id = todos[1]._id.toHexString().toString()
        request(app)
            .delete(`/todos/${_id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(_id)
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                //query database using findById toNotExist
                //expect (null).toNotExist()
                Todo.findById(_id).then((todo) => {
                    expect(todo).toBeUndefined
                    done()
                }).catch((err) => {
                    done(err)
                })

            })
    })

    it('Should return 404 if todo not found', (done) => {
        request(app)
            .delete('/todos/123456')
            .expect(404)
            .end(done)
    })

    it('Should return 404 if object id is invalid', (done) => {
        request(app)
            .delete('/todos/5be8559d4ef02c7c48fa13d9123')
            .expect(404)
            .end(done)
    })

})