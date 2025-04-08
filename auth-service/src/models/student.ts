import mongoose from "mongoose"

const studentSchema = new mongoose.Schema(
    {
        ime: String,
        prezime: String,
        kor_ime: String,
        lozinka: String,
        mejl: String,
        uloga: String,
        godina: Number,
        pol: String,
        godina_upisa: String,
        indeks: Number,
        datum_rodjenja: Date
    }
)

export default mongoose.model('StudentModel', studentSchema, 'student');