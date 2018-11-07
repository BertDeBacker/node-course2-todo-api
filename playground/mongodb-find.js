//const MongoClient = require('mongodb').MongoClient
const { MongoClient, ObjectID } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (err, client) => {

    if (err) {
        return console.log('Unable to connect to MongoDB server.')
    }
    console.log('Connected to MongoDB server.')

    // const db = client.db('TodoApp')
    // db.collection('Todos').find({
    //     _id: new ObjectID('5be2f1b8032a80376f589ac2')
    // }).toArray().then((docs) => {
    //     console.log('Todos')
    //     console.log(JSON.stringify(docs, undefined, 5))
    // }, (err) => {
    //     console.log('Unable to fetch Todos', err)
    // });

    // const db = client.db('TodoApp')
    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Todos count: ${count}`)
    //         //console.log(JSON.stringify(docs, undefined, 5))
    // }, (err) => {
    //     console.log('Unable to fetch Todos', err)
    // });

    const db = client.db('TodoApp')
    db.collection('Users').find({ name: 'Bert' }).toArray().then((docs) => {
        console.log('Users Bert', docs)
    }, (err) => {
        console.log('Unable to fetch User', err)
    });

    db.collection('Users').find({ name: 'Bert' }).count().then((count) => {
        console.log(`Users 'Bert': ${count} found.`)
    }, (err) => {
        console.log('Unable to fetch user', err)
    });


    //client.close();
    //console.log('Connection to MongoDB server closed.')

})