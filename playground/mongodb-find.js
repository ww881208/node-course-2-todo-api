// const MongoClient = require('mongodb').MongoClient;
// const ObjectID= require('mongodb').ObjectID;
const {MongoClient, ObjectID} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err){
        return console.log('Unable to connect to MongoDB Server.', err);
    }

    console.log('Successfully connected to MongoDB Server.');

    const db = client.db('TodoApp');
    // db.collection('Todos').find({completed:true}).toArray().then((docs) => {
    
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
  
    // }, (err) => {

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });
    
//     db.collection('Todos').find().count().then((count) => {
//         console.log(`Todos count: ${count}`);
  
//     }, (err) => {

//         console.log(JSON.stringify(result.ops, undefined, 2));
//     });

//     db.collection('Todos').find({
//         _id: new ObjectID('5aca9745f706eab2a00c57b7')
//     }).toArray().then((docs) => {
    
//         console.log('Todos');
//         console.log(JSON.stringify(docs, undefined, 2));
  
//     }, (err) => {
// ''
//         console.log(JSON.stringify(result.ops, undefined, 2));
//     });


    db.collection('Users').find({name: 'eagle'}).toArray().then((docs) => {
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch Todos', err);
    });
    

    //client.close();
});