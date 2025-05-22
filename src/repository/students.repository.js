import {Student} from "../model/student.js";

const students = new Map();

export const addStudent = ({id, name, password}) => {
    if (students.has(id)) {
        return false;
    }
    students.set(id, new Student(id, name, password));
    return true;
}

export const findStudent = (id) => students.get(id);

export const deleteStudent = (id) => {
    const student = students.get(id);
    if (student) {
        students.delete(id);
        return student;
    }
}

export const updateStudent = (id, data) => {
    const student = students.get(id);
    if (student) {
        Object.assign(student, data);
        return student;
    }
}

export const addScore = (id, scoreData) => {
    const student = students.get(id);
    if (student) {
        const examName = scoreData.examName;
        const scoreValue = scoreData.score;
        if (examName && typeof scoreValue === 'number') {
            student.scores = {
                ...student.scores, [examName]: scoreValue
            };
            return student;
        }
    }
};

export const findByName = (name) => {
    const LowerCaseName = name.toLowerCase();
    for (const student of students.values()) {
        if (student.name.toLowerCase() === LowerCaseName) {
            return student;
        }
    }
};

export const countByName = (names) => {
    const lowerCaseNames = new Set(Array.isArray(names) ? names.map(n => n.toLowerCase()) : [names.toLowerCase()]);
    const allStudents = Array.from(students.values());
    return allStudents.filter(s => lowerCaseNames.has(s.name.toLowerCase())).length;
};

export const findByMinScore = (exam, minScore) => {
    const result = [];
    for (const student of students.values()) {
        const score = student.scores[exam];
        if (typeof score === 'number' && score >= minScore) {
            result.push(student);
        }
    }
    return result;
};
