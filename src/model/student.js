import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    _id: {type: Number, required: true},
    name: {type: String, required: true},
    password: {type: String, required: true},
    scores: {
        type: Map,
        key: String,
        of: Number,
        default: {}
    }
}, {
    toObject: {
        versionKey: false,
        transform: function (doc, ret) {
            const id = ret._id;
            delete ret._id;

            const result = { id };

            for (const key in ret) {
                if (key !== 'id') {
                    result[key] = ret[key];
                }
            }
            return result;
        }
    },
    toJSON: {
        versionKey: false,
        transform: function (doc, ret) {
            const id = ret._id;
            delete ret._id;

            const result = { id };

            for (const key in ret) {
                if (key !== 'id') {
                    result[key] = ret[key];
                }
            }
            return result;
        }
    }
});

const Student = mongoose.model('Student', studentSchema, 'college');
export default Student;