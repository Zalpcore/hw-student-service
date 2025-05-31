// src/__test__/students.controller.test.js
import {jest} from '@jest/globals';
import request from 'supertest';

let service;
let app;

beforeAll(async () => {
    // Мокаем сервис
    jest.unstable_mockModule('../services/students.service.js', () => ({
        addStudent: jest.fn(),
        findStudent: jest.fn(),
        updateStudent: jest.fn(),
        deleteStudent: jest.fn(),
        addScore: jest.fn(),
        findByName: jest.fn(),
        countByNames: jest.fn(),
        findByMinScore: jest.fn(),
    }));

    // После mock — импортируем service и app
    service = await import('../services/students.service.js');
    app = (await import('../app.js')).default;
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Students Controller', () => {
    describe('POST /student', () => {
        it('should create student (201)', async () => {
            service.addStudent.mockResolvedValue(true);

            const res = await request(app)
                .post('/student')
                .send({id: 1, name: 'John', password: 'secret'});

            expect(service.addStudent).toHaveBeenCalled();
            expect(res.statusCode).toBe(201);
        });

        it('should return 400 if validation fails', async () => {
            const res = await request(app)
                .post('/student')
                .send({name: 'John'}); // нет id, password

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        it('should return 409 if student already exists', async () => {
            service.addStudent.mockResolvedValue(false);

            const res = await request(app)
                .post('/student')
                .send({id: 1, name: 'John', password: 'secret'});

            expect(service.addStudent).toHaveBeenCalled();
            expect(res.statusCode).toBe(409);
        });
    });

    describe('GET /student/:id', () => {
        it('should return student if found', async () => {
            service.findStudent.mockResolvedValue({id: 1, name: 'John'});

            const res = await request(app).get('/student/1');

            expect(service.findStudent).toHaveBeenCalledWith(1);
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({id: 1, name: 'John'});
        });

        it('should return 404 if not found', async () => {
            service.findStudent.mockResolvedValue(null);

            const res = await request(app).get('/student/1');

            expect(res.statusCode).toBe(404);
        });
    });

    describe('PATCH /student/:id', () => {
        it('should update student', async () => {
            service.updateStudent.mockResolvedValue({id: 1, name: 'Johnny'});

            const res = await request(app)
                .patch('/student/1')
                .send({name: 'Johnny'});

            expect(service.updateStudent).toHaveBeenCalledWith(1, {name: 'Johnny'});
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({id: 1, name: 'Johnny'});
        });

        it('should return 400 if validation fails', async () => {
            const res = await request(app)
                .patch('/student/1')
                .send({unknownField: 'test'});

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        it('should return 404 if not found', async () => {
            service.updateStudent.mockResolvedValue(null);

            const res = await request(app)
                .patch('/student/1')
                .send({name: 'Johnny'});

            expect(res.statusCode).toBe(404);
        });
    });

    describe('DELETE /student/:id', () => {
        it('should delete student', async () => {
            service.deleteStudent.mockResolvedValue({id: 1, name: 'John'});

            const res = await request(app).delete('/student/1');

            expect(service.deleteStudent).toHaveBeenCalledWith(1);
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({id: 1, name: 'John'});
        });

        it('should return 404 if not found', async () => {
            service.deleteStudent.mockResolvedValue(null);

            const res = await request(app).delete('/student/1');

            expect(res.statusCode).toBe(404);
        });
    });

    describe('PATCH /score/student/:id', () => {
        it('should add score', async () => {
            service.addScore.mockResolvedValue(true);

            const res = await request(app)
                .patch('/score/student/1')
                .send({examName: 'math', score: 95});

            expect(service.addScore).toHaveBeenCalledWith(1, 'math', 95);
            expect(res.statusCode).toBe(204);
        });

        it('should return 400 if validation fails', async () => {
            const res = await request(app)
                .patch('/score/student/1')
                .send({score: 95}); // нет examName

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        it('should return 409 if conflict', async () => {
            service.addScore.mockResolvedValue(false);

            const res = await request(app)
                .patch('/score/student/1')
                .send({examName: 'math', score: 95});

            expect(service.addScore).toHaveBeenCalledWith(1, 'math', 95);
            expect(res.statusCode).toBe(409);
        });
    });

    describe('GET /students/name/:name', () => {
        it('should return students', async () => {
            service.findByName.mockResolvedValue([{id: 1, name: 'John'}]);

            const res = await request(app).get('/students/name/John');

            expect(service.findByName).toHaveBeenCalledWith('John');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual([{id: 1, name: 'John'}]);
        });
    });

    describe('GET /quantity/students', () => {
        it('should return count', async () => {
            service.countByNames.mockResolvedValue(3);

            const res = await request(app).get('/quantity/students?names=John&names=Jane');

            expect(service.countByNames).toHaveBeenCalledWith(['John', 'Jane']);
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({count: 3});
        });
    });

    describe('GET /students/exam/:exam/minscore/:minscore', () => {
        it('should return students with min score', async () => {
            service.findByMinScore.mockResolvedValue([{id: 1, name: 'John', score: 95}]);

            const res = await request(app).get('/students/exam/math/minscore/90');

            expect(service.findByMinScore).toHaveBeenCalledWith('math', '90');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual([{id: 1, name: 'John', score: 95}]);
        });
    });
});
