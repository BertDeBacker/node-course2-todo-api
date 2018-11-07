//const MongoClient = require('mongodb').MongoClient
const { MongoClient, ObjectID } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (err, client) => {

    if (err) {
        return console.log('Unable to connect to MongoDB server.')
    }
    console.log('Connected to MongoDB server.')

    const db = client.db('TodoApp');

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5be30da37f82164efc3b838f')
    }, {
        $inc: { age: 1 },
        $set: { name: 'Bert' }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result)
    })

    //client.close();
    //console.log('Connection to MongoDB server closed.')

})