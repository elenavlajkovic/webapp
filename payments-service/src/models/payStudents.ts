import mongoose from "mongoose"

const payStudentsSchema = new mongoose.Schema(
    {
        kor_ime: String,
        cena_godine: Number
    }
)

export default mongoose.model('PayStudentsModel', payStudentsSchema, 'PayStudents');