import mongoose from "mongoose"

const subjectSchema = new mongoose.Schema(
    {
        naziv: { type: String, required: true },
        profesori: [
          {
            ime: { type: String, required: true },
            prezime: { type: String, required: true },
            kor_ime: { type: String, required: true }
          }
        ],
        semestri: [{ type: Number, required: true }],
        espb: Number,
        sifra: String,
        obavezan: Boolean,
        studenti: [
          {
            ime: { type: String, required: true },
            prezime: { type: String, required: true },
            kor_ime: { type: String, required: true }
          }
        ],
    }
)

export default mongoose.model('SubjectModel', subjectSchema, 'Subject');