import mongoose from "mongoose"

const examSchema = new mongoose.Schema(
    {
        naziv: String,
        pocetak: Date,
        kraj: Date,
        prijavaIspita: {type: Boolean, default: false}
    }
)

export default mongoose.model('ExamModel', examSchema, 'Exam');