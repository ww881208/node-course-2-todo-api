const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    text: 'first test todo'
}, {
    text: 'second test todo'
}];

// beforeEach((done) => {
//     Todo.remove({}).then(() => done());
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