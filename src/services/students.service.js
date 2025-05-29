import * as repo from '../repository/students.repository.js';

export const addStudent = async ({id, name, password}) => {
    const existing = await repo.findStudentById(id);
    if (existing) {
        return false;
    }
    await repo.createStudent({_id: id, name, password});
    return true;
}

export const findStudent = async (id) => {
    const studentFull = await repo.findStudentById(id);
    const studentNoPass = studentFull.toObject();
    delete studentNoPass.password;
    return studentNoPass;
}

export const deleteStudent = async (id) => {
    const studentFull = await repo.deleteStudentById(id);
    const studentNoPass = studentFull.toObject();
    delete studentNoPass.password;
    return studentNoPass;
}

export const updateStudent = async (id, data) => {
    const studentFull = await repo.updateStudentById(id, data);
    const studentNoScore = studentFull.toObject();
    delete studentNoScore.scores;
    return studentNoScore;
}

export const addScore = async (id, exam, score) => {
    return await repo.updateStudentScore(id, exam, score);
}

export const findByName = async (name) => {
    return (await repo.findStudentsByName(name))
        .map(student => {
            const studentNoPass = student.toObject()
            delete studentNoPass.password;
            return studentNoPass;
        });
};

export const countByNames = async (names) => {
    return await repo.countStudentsByNames(names);
};

export const findByMinScore = async (exam, minScore) => {
    return (await repo.findStudentsByMinScores(exam, minScore))
        .map(student => {
            const studentNoPass = student.toObject({ flattenMaps: true })
            delete studentNoPass.password;
            return studentNoPass;
        });
};
