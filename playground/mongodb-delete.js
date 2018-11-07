//const MongoClient = require('mongodb').MongoClient
const { MongoClient, ObjectID } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (err, client) => {

    if (err) {
        return console.log('Unable to connect to MongoDB server.')
    }
    console.log('Connected to MongoDB server.')

    const db = client.db('TodoApp');
    // deleteMany

    // db.collection('Todos').deleteMany({ text: 'eat lunch' }).then((result) => {
    //     console.log(result);
    // })

    // deleteOne
    // db.collection('Todos').deleteOne({ text: 'eat lunch' }).then((result) => {
    //     console.log(result);
    // })


    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({ text: 'eat lunch' }).then((result) => {
    //     console.log(result);
    // })

    db.collection('Users').findOneAndDelete({
        _id: new ObjectID('5be2de1629f3bc25448fd9f3')
    }).then((result) => {
        console.log('Deleted following document')
        console.log(result)
    })

    // db.collection('Users').deleteMany({ name: 'Bert' }).then((result) => {
    //     console.log('Deleted following document')
    //     console.log(result)
    // })

    //db.collection('Todos').deleteMany({});


    //client.close();
    //console.log('Connection to MongoDB server closed.')

})