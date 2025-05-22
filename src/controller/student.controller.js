import * as repo from "../repository/students.repository.js";

export const addStudent = (req, res) => {
    const success = repo.addStudent(req.body);
    if (success) {
        res.status(204).send();
    } else {
        res.status(409).send();
    }
}

export const findStudent = (req, res) => {
    const student = repo.findStudent(+req.params.id);
    if (student) {
        const tmp = {...student};
        delete tmp.password;
        res.json(tmp);
    } else {
        res.status(404).send();
    }
}

export const updateStudent = (req, res) => {
    const student = repo.updateStudent(+req.params.id, req.body);
    if (student) {
        const tmp = {...student};
        delete tmp.scores;
        res.json(tmp);
    } else {
        res.status(404).send();
    }
}

export const deleteStudent = (req, res) => {
    const student = repo.deleteStudent(+req.params.id);
    if (student) {
        delete student.password;
        res.json(student);
    } else {
        res.status(404).send();
    }
}

export const addScore = (req, res) => {
   const studentScore = repo.addScore(+req.params.id, req.body);
   if (studentScore) {
       const tmp = {...studentScore};
       delete tmp.password;
       res.json(tmp);
   } else {
       res.status(404).send();
   }
}

export const findByName = (req, res) => {
    const student = repo.findByName(req.params.name);
    if (student) {
        const tmp = {...student};
        delete tmp.password;
        res.json(tmp);
    } else {
        res.status(404).type('text/plain; charset=utf-8').send(`Student with name: ${name} not found`);
    }
}

export const countByNames = (req, res) => {
    const count = repo.countByName(req.query.names);
    if(count) {
        res.json(count);
    }
    else {
        res.status(404).send();
    }
}

export const findByMinScore = (req, res) => {
    const exam = req.params.exam;
    const minScore = +req.params.minscore;
    const students = repo.findByMinScore(exam, minScore);
    if (students.length > 0) {
        const result = students.map(({ password, ...rest }) => rest);
        res.json(result);
    } else {
        res.status(404).json({ message: 'No students found' });
    }
};

