const { ObjectID } = require('mongodb');
const { mongose } = require('./../server/dev/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

Todo.remove({}).then((result) => {
    console.log(result);
})