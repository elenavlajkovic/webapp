import mongoose from "mongoose"

const studentSubjectSchema = new mongoose.Schema(
    {
        kor_ime: { type: String, required: true },
        predmeti: [
          {
            sifra: { type: String, required: true },
            polozio: { type: Boolean, default: false, required: true },
          }
        ],
    }
)

export default mongoose.model('StudentSubjectModel',  studentSubjectSchema, 'StudentSubject');