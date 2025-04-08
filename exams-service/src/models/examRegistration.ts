import mongoose from "mongoose"

const examRegistrationSchema = new mongoose.Schema(
    {
        predmet: { type: String, required: true },
        datum: { type: Date, required: true },
        vreme_pocetka: { type: String, required: true },
        vreme_kraja: { type: String, required: true },
        sale: { type: [Number], required: true },
        studenti: [
            {
              ime: { type: String, required: true },
              prezime: { type: String, required: true },
              kor_ime: { type: String, required: true },
              ocena: { type: Number, required: true },
              sala: { type: Number, required: true },
            }
        ],
        profesori: [
          {
            kor_ime: { type: String, required: true }
          }
        ]
       
    }
)

export default mongoose.model('ExamRegistrationModel', examRegistrationSchema, 'ExamRegistration');