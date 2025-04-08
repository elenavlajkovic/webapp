import mongoose from "mongoose"

const TimeTableSchema = new mongoose.Schema(
    {
        predmet: { type: String, required: true },
        profesor: { 
            ime: { type: String, required: true },
            prezime: { type: String, required: true },
            kor_ime: { type: String, required: true }
        },
        godine: { type: [Number], required: true },
        dan: { type: String, required: true },
        vreme_pocetka: { type: String, required: true },
        vreme_kraja: { type: String, required: true },
        sala: { type: Number, required: true },
        tip: { type: String, required: true }
    }
)

export default mongoose.model('TimeTableModel', TimeTableSchema, 'TimeTable');