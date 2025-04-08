import mongoose from "mongoose"

const deletedtestSchema = new mongoose.Schema(
    {
        predmet: { type: String, required: true },
        datum: { type: Date, required: true },
        vreme_pocetka: { type: String, required: true },
        vreme_kraja: { type: String, required: true },
        sale: { type: [Number], required: true },
        godine: { type: [Number], required: true },
        zakazao: { type: String },
        profesori: [
            {
              ime: { type: String, required: true },
              prezime: { type: String, required: true },
              kor_ime: { type: String, required: true },
              video: { type: Boolean, required: false }
            }
          ],
    }
)

export default mongoose.model('DeletedTestModel', deletedtestSchema, 'DeletedTest');