const _ = require('lodash')
const expect = require('expect')
const request = require('supertest')
const { ObjectID } = require('mongodb')

const { app } = require('./../server')
const { Todo } = require('./../models/todo')
const { User } = require('./../models/user')

const { todos, populateTodos, users, populateUsers } = require('./seed/seed')


beforeEach(populateTodos)
before(populateUsers)




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
                expect(res.body.text).toBe(text)
            })
            .end((err, res) => {
                if (err) {
                    //we add return here so that the function stops exection
                    return done(err)
                }

                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1)
                    expect(todos[0].text).toBe(text)
                    done()
                }).catch((e) => {
                    done(e)
                })
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

describe('PATCH /todos/:id', () => {

    it('Should update the todo', (done) => {
        //grab id of first item
        var _id = todos[0]._id
            //console.log(`id: ${_id}`);

        //update text, set completed true
        var body = { 'completed': true, 'text': 'This is the new todo text' }
        request(app)
            .patch(`/todos/${_id}`)
            .send(body)
            //200
            .expect(200)
            //custom assertion, text is changed, completed is true and completedAt is a number(tobeA)
            .expect((res) => {
                var body2 = _.pick(res.body, ['text', 'completed', 'completedAt'])
                expect(body2.completed).toBe(true)
                expect(body2.text).toBe(body.text)
                expect(typeof body2.completedAt).toBe('number')
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                done()
            })
    })

    it('Should clear completedAt when todo is not completed', (done) => {
        //grab id of second todo item
        var _id = todos[1]._id
            //update text, set completed to false
        var body = { 'completed': false, 'text': 'Updated text for test' }
        request(app)
            .patch(`/todos/${_id}`)
            .send(body)
            //200
            .expect(200)
            .expect((res) => {
                var body2 = _.pick(res.body, ['completed', 'completedAt', 'text'])
                    //text is changed, completed is false, completedAt is null .toNotExist
                expect(body2.text).toBe(body.text)
                expect(body2.completed).toBe(false);
                expect(body2.completedAt).toNotExist
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                done()
            })
    })
})


describe('GET /users/me', () => {

    it('should return user if authenticated', (done) => {
        request(app)
            .get('/user/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toString())
                expect(res.body.email).toBe(users[0].email)
            })
            .end(done)
    })

    it('should return 404 if not authenticated', (done) => {
        request(app)
            .get('/user/me')
            .set('')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual(undefined)
            })
            .end(done())
    })

})

describe('POST /users', () => {

    it('Should create a user', (done) => {
        var email = 'example@example.com'
        var password = '123mnb!'

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.header['x-auth']).toBeDefined
                expect(res.body._id).toBeDefined
                expect(res.body.email).toBe(email)
            })
            .end((err) => {
                if (err) {
                    return done(err)
                }
                User.find({ email }).then((user) => {
                    //console.log(user)
                    //expect(user).toBeDefined()
                    //expect(user.password).toNotEqual(password)
                    if (user) console.log('er is een user')
                    done()
                }).catch((e) => done(e))

            })
    })

    it('Should return validation errors if request is invalid', (done) => {

        request(app)
            .post('/users')
            .send({
                email: 'and',
                password: '123'
            })
            .expect(400)
            .end(done)
    })


    it('Should not create a user if email is already used', (done) => {
        var email = users[0].email
        var password = '123mnb!'

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .end((err) => {
                if (err) {
                    return done(err)
                }
                done()
            })


    })
})

describe('POST /users/login ', () => {

    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy()
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                User.findById(users[1]._id)
                    .then((user) => {
                        expect(user.tokens.length).toBeGreaterThanOrEqual(1)
                            // expect(user.tokens[0]).toContain({
                            //     access: 'auth',
                            //     token: res.headers['x-auth']
                            // })
                        done()
                    })
                    .catch((e) => done(e))
            })
    })

    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: 'blabla'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeFalsy()
            })
            .end(done)
    })

})