import * as repo from "../repository/students.repository.js";

export const addStudent = async (req, res) => {
    const success = await repo.addStudent(req.body);
    if (success) {
        res.status(204).send();
    } else {
        res.status(409).send();
    }
}

export const findStudent = async (req, res) => {
    const student = await repo.findStudent(+req.params.id);
    if (student) {
        delete student.password;
        res.json(student);
    } else {
        res.status(404).send();
    }
}

export const updateStudent = async (req, res) => {
    const student = await repo.updateStudent(+req.params.id, req.body);
    if (student) {
        delete student.scores;
        res.json(student);
    } else {
        res.status(404).send();
    }
}

export const deleteStudent = async (req, res) => {
    const student = await repo.deleteStudent(+req.params.id);
    if (student) {
        delete student.password;
        res.json(student);
    } else {
        res.status(404).send();
    }
}

export const addScore = async (req, res) => {
    const success = await repo.addScore(+req.params.id, req.body.examName, req.body.score);
    if (success) {
        res.status(204).send();
    } else {
        res.status(404).send();
    }
}

export const findByName = async (req, res) => {
    const students = (await repo.findByName(req.params.name))
        .map(student => {
            delete student.password;
            return student;
        });
    res.json(students);
}

export const countByNames = async (req, res) => {
    try {
        const namesCount = await repo.countByName(req.query.names);
        res.json(namesCount);
    } catch (err) {
        console.error("DB error", err);
        res.status(500).json({error: "Internal server error"});
    }
}

export const findByMinScore = async (req, res) => {
    const exam = req.params.exam;
    const minScore = +req.params.minscore;
    const students = (await repo.findByMinScore(exam, minScore))
        .map(({ password, ...rest }) => rest);
        res.json(students);
};

