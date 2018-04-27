const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {ObjectID} = require('mongodb');

const todos = [{
    _id: new ObjectID(),
    text: 'first test todo'
}, {
    _id: new ObjectID(),
    text: 'second test todo'
}];

beforeEach((done) => {
    Todo.remove({}).then(() => done());
});

beforeEach((done) => {
    
    Todo.insertMany(todos);
    done();
    //.then(() => done());
});

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