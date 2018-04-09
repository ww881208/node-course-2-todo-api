const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err){
        return console.log('Unable to connect to MongoDB Server.', err);
    }

    console.log('Successfully connected to MongoDB Server.');

    const db = client.db('TodoApp');
    db.collection('Todos').insertOne({

        text: 'Something to do',
        completed: false
    }, (err, result) => {
        if(err){
            return console.log('Unable to insert Todos', err);
        }

        console.log(JSON.stringify(result.ops, undefined, 2));
    });
    
    db.collection('Users').insertOne({

        name: 'eagle',
        age: 20,
        location: 'chicago'

    }, (err, result) => {
        if(err){
            return console.log('Unable to insert Users', err)
        }

        console.log(JSON.stringify(result.ops, undefined, 2));
    });
    client.close();
});