//import { mongoose } from "./../server/db/mongoose";
//import {Todo} from "./../server/models/todo";
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id = '5ad6b83c7089bd058edda3a9';

Todo.find({
    _id:id
}).then((todos) => {
    console.log(todos);
});

Todo.findOne({
    _id: id
}).then((todo) => {
    console.log(todo);
});

Todo.findById(id).then((todo) => {
    if(!todo){
        console.log(id + 'not found');
    }
    console.log(todo);
}).catch((e) => console.log(e));