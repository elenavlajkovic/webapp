import mongoose from "mongoose"

const studentGradesSchema = new mongoose.Schema(
    {
        ime: String,
        prezime: String,
        kor_ime: String,
        predmet: String,
        ocena: Number,
        espb: Number
    }
)

export default mongoose.model('StudentGradesModel', studentGradesSchema, 'studentGrades');