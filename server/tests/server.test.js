const expect = require('expect')
const request = require('supertest')

const { app } = require('./../server')
const { Todo } = require('./../models/todo')

const todos = [{
    text: 'First test todo'
}, {
    text: 'Second test todo'
}]

beforeEach((done) => {
    //this will delete all todos in the database
    Todo.remove({}).then(() => {
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