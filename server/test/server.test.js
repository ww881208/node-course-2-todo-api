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

// beforeEach((done) => {
//     Todo.remove({}).then(() => done());
// });

// beforeEach((done) => {
//     Todo.insertMany(todos).then(() => done());
// });

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
                expect(todos.length).toBeGreaterThan(1);
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
                expect(todos[todos.length-1].text).toBe('Test todo text');
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
    it('it should get a desired todo', (done) => {
        request(app)
        .get('/todos/' + '5adfdc2800273b21d24bc478')
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