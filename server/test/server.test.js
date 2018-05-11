const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {ObjectID} = require('mongodb');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

// const todos = [{
//     _id: new ObjectID(),
//     text: 'first test todo'
// }, {
//     _id: new ObjectID(),
//     text: 'second test todo',
//     completed: false,
//     completedAt: 3333
// }];

// beforeEach((done) => {
//     Todo.remove({}).then(() => done());
// });

// beforeEach((done) => {
    
//     Todo.insertMany(todos);
//     done();
//     //.then(() => done());
// });
beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('it should create a new todo', (done) => {
        var text = 'Test todo text';
        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }

            Todo.find({text}).then((todos) => {
                //expect(todos.length).toBeGreaterThanOrEqualTo(0);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) =>  done(e));
        });
    });

    it('it should not create a new todo with invalid body data', (done) => {
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
            if(err){
                return done(err);
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBeGreaterThan(1);
                expect(todos[0].text).toBe('first test todo');
                done();
            }).catch((e) => done(e));
        });

    });
});

describe('GET /todos', () => {
    
    it('It should get all todos', (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBeGreaterThan(1);
        })
        .end(done);
    });
});

describe('GET /todos/id', () => {
    var id = todos[0]._id;
    it('it should get a desired todo', (done) => {
        request(app)
        .get('/todos/' + id)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe('first test todo');
        })
        .end(done);
    });

    it('it should return 404 if todo not found', (done) => {
        request(app)
        .get('/todos/' + '5adfdc2800273b21d24bc489')
        .expect(404)
        .end(done);
    });

    it('should return 404 if pass int non-objectid', (done) => {
        request(app)
        .get('/todos/' + '5adfdc2800273b21d24bc478a')
        .expect(404)
        .expect((res) => {
            expect(res.body.todo).toExist;
        })
        .end(done);

    });

});

describe('DELETE /todos/:id', () => {

    var hexId = todos[1]._id.toHexString();

    it('should remove a todo', (done) => {
        request(app)
        .delete('/todos/' + hexId)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(hexId)
        })        
        .end((err, res) => {
            if(err){
                return done(err);
            }        

            Todo.findById(hexId).then((todo) => {
                expect(404);
                done();
            }).catch((e) => done(e));
        });
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
        .delete('/todos/' + '5adfdc2800273b21d24bc478')
        .expect(404)
        .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
        .delete('/todos/123')
        .expect(404)
        .end(done);
    })
});

describe('PATCH /todos/:id', () =>{

    it('should update a todo', (done) => {
        var hexId= todos[0]._id.toHexString();
        var text = 'text from patch';

        request(app)
        .patch('/todos/' + hexId)
        .send({
            text:text,
            completed: true
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe('text from patch');
            expect(res.body.todo.completed).toBe(true);
            expect(typeof res.body.todo.completedAt).toBe('number');
        
        })
        .end(done);            
    });

    it('should clear completedAt when todo is not completed', (done) => {
        var hexid = todos[1]._id.toHexString();

        request(app)
        .patch('/todos/' + hexid)
        .send({
            completed: false
            // completedAt: null
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toBeNull();
        })
        .end(done)
    });
});

describe('POST /users', () => {

    it('should create a user', (done) => {
        var email = 'example@example.com';
        var password = 'xxy123';
        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toExist;
            expect(res.body._id).toExist;
            expect(res.body.email).toBe(email);
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }

            User.findOne({email}).then((user) => {
                expect(user).toExist;
                expect(user.password).not.toBe(password);
                done();
            }).catch((e) => done(e));
        });

    }); 
    
    it('should not create a user if email is in use', (done) => {
        request(app)
        .post('/users')
        .send({
            email: users[0].email,
            password: 'qwr4321'
        })
        .expect(400)
        .end(done);

    });
});

describe('POST /users/login', () => {

    it('should login user and return auth token', (done) => {
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: users[1].password
        })
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeTruthy();
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }

            User.findById(users[1]._id).then((user) => {
                // expect(user.tokens[0]).toInclude({
                //     access: 'auth',
                //     token: res.headers['x-auth']
                // });
                expect(user.tokens[0]).toBeTruthy();
                done();
            }).catch((e) => { 
                done(e);
            });

        });
    });

    it('should reject invalid login', (done) => {

        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: 'wrong123'
        })
        .expect(400)
        .end(done);
    });
});
