const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

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

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        console.log('invalid id');
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        else{
            res.send({todo});
        }
    }).catch((e) => {
        console.log(e);
        res.status(400).send({});
    });
});

app.patch('/todos/:id', (req, res) => {

    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)){
        console.log('Invalid id passed');
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }
    else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo){
            return res.status(400).send();
        }

        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
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