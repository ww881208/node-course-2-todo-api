var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.port || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {

    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((result) => {
        res.send(result);
    }, (e) => {
        res.status(400).send(e);
    });

});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        console.log('Invalid id');
        return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if(!todo){
            res.status(404).send();
        }
        else{
            res.status(200).send({todo});
        }
    }).catch((e) => {
        console.log(e);
        res.status(400).send({});
    });
});


app.listen(port, () => {
    console.log('Server start at the port: ' + port);
})

module.exports = {app};

// var TodoInstance = new Todo({
//     text: 'Cook Dinner',
//     completed: true,
//     completedAt: Date.now()
// })

// TodoInstance.save().then((result) => {
//     console.log('Save to Db');
//     console.log(result);
// }, (err) => {
//     console.log('Unable to save to DB, ', err);
// });

// var ToDo2 = new Todo({
//     text: 'learn node.js',
//     completed: false,
//     comepletAt:2000
// });

// ToDo2.save().then((result) => {
//     console.log('Saved to db');
//     console.log(result);
// }, (e) => {
//     console.log('Unable saved to Db', e);
// });



// var auser = new User({
//     email: '  2@1.com '
// });

// auser.save().then((result) => {
//     console.log('Saved to DB');
//     console.log(result);
// }, (e) => {
//     console.log('Unable to save to DB', e);
// });