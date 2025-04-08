import mongoose from "mongoose"

const professorSchema = new mongoose.Schema(
    {
        ime: String,
        prezime: String,
        kor_ime: String,
        lozinka: String,
        mejl: String,
        uloga: String,
        pol: String,
        datum_rodjenja: Date
    }
)

export default mongoose.model('ProfessorModel', professorSchema, 'professor');