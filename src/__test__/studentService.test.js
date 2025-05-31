// src/__test__/studentService.test.js
import {jest} from '@jest/globals';

// Мокаем модуль репозитория
jest.unstable_mockModule('../repository/students.repository.js', () => ({
    findStudentById: jest.fn(),
    createStudent: jest.fn(),
    deleteStudentById: jest.fn(),
    updateStudentById: jest.fn(),
    updateStudentScore: jest.fn(),
    findStudentsByName: jest.fn(),
    countStudentsByNames: jest.fn(),
    findStudentsByMinScores: jest.fn()
}));

// Теперь после mock'а нужно динамически импортировать service и repo:
const repo = await import('../repository/students.repository.js');
const service = await import('../services/students.service.js');

describe('Student Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('addStudent', () => {
        it('should add a new student if not exists', async () => {
            repo.findStudentById.mockResolvedValue(null);
            repo.createStudent.mockResolvedValue({});
            const result = await service.addStudent({id: 1, name: 'John', password: 'pass'});
            expect(repo.findStudentById).toHaveBeenCalledWith(1);
            expect(repo.createStudent).toHaveBeenCalledWith({_id: 1, name: 'John', password: 'pass'});
            expect(result).toBe(true);
        });

        it('should not add student if already exists', async () => {
            repo.findStudentById.mockResolvedValue({_id: 1});
            const result = await service.addStudent({id: 1, name: 'John', password: 'pass'});
            expect(repo.findStudentById).toHaveBeenCalledWith(1);
            expect(repo.createStudent).not.toHaveBeenCalled();
            expect(result).toBe(false);
        });
    });

    describe('findStudent', () => {
        it('should return student without password', async () => {
            const mockStudent = {
                toObject: () => ({id: 1, name: 'John', password: 'secret'})
            };
            repo.findStudentById.mockResolvedValue(mockStudent);
            const result = await service.findStudent(1);
            expect(repo.findStudentById).toHaveBeenCalledWith(1);
            expect(result).toEqual({id: 1, name: 'John'});
        });
    });

    describe('deleteStudent', () => {
        it('should delete student and return without password', async () => {
            const mockStudent = {
                toObject: () => ({id: 1, name: 'John', password: 'secret'})            };
            repo.deleteStudentById.mockResolvedValue(mockStudent);
            const result = await service.deleteStudent(1);
            expect(repo.deleteStudentById).toHaveBeenCalledWith(1);
            expect(result).toEqual({id: 1, name: 'John'});
        });
    });

    describe('updateStudent', () => {
        it('should update student and return without scores', async () => {
            const mockStudent = {
                toObject: () => ({id: 1, name: 'John', scores: {math: 90}})
            };
            repo.updateStudentById.mockResolvedValue(mockStudent);
            const result = await service.updateStudent(1, {name: 'Johnny'});
            expect(repo.updateStudentById).toHaveBeenCalledWith(1, {name: 'Johnny'});
            expect(result).toEqual({id: 1, name: 'John'});
        });
    });

    describe('addScore', () => {
        it('should call updateStudentScore', async () => {
            repo.updateStudentScore.mockResolvedValue('OK');
            const result = await service.addScore(1, 'math', 95);
            expect(repo.updateStudentScore).toHaveBeenCalledWith(1, 'math', 95);
            expect(result).toBe('OK');
        });
    });

    describe('findByName', () => {
        it('should return students without passwords', async () => {
            const mockStudents = [
                {toObject: () => ({id: 1, name: 'John', password: 'secret'})},
                {toObject: () => ({id: 2, name: 'Jane', password: 'secret'})}
            ];
            repo.findStudentsByName.mockResolvedValue(mockStudents);
            const result = await service.findByName('J');
            expect(repo.findStudentsByName).toHaveBeenCalledWith('J');
            expect(result).toEqual([
                {id: 1, name: 'John'},
                {id: 2, name: 'Jane'}
            ]);
        });
    });

    describe('countByNames', () => {
        it('should call countStudentsByNames', async () => {
            repo.countStudentsByNames.mockResolvedValue(3);

            const result = await service.countByNames(['John', 'Jane', 'Jack']);

            expect(repo.countStudentsByNames).toHaveBeenCalledWith(['John', 'Jane', 'Jack']);
            expect(result).toBe(3);
        });
    });

    describe('findByMinScore', () => {
        it('should return students without passwords', async () => {
            const mockStudents = [
                {toObject: () => ({id: 1, name: 'John', password: 'secret', scores: {math: 95}})},
                {toObject: () => ({id: 2, name: 'Jane', password: 'secret', scores: {math: 97}})}
            ];
            repo.findStudentsByMinScores.mockResolvedValue(mockStudents);

            const result = await service.findByMinScore('math', 90);

            expect(repo.findStudentsByMinScores).toHaveBeenCalledWith('math', 90);
            expect(result).toEqual([
                {id: 1, name: 'John', scores: {math: 95}},
                {id: 2, name: 'Jane', scores: {math: 97}}
            ]);
        });
    });
});