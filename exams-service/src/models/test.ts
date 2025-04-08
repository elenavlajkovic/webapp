import mongoose from "mongoose"

const testSchema = new mongoose.Schema(
    {
        predmet: { type: String, required: true },
        datum: { type: Date, required: true },
        vreme_pocetka: { type: String, required: true },
        vreme_kraja: { type: String, required: true },
        sale: { type: [Number], required: true },
        godine: { type: [Number], required: true },
        zakazao: { type: String },
    }
)

export default mongoose.model('TestModel', testSchema, 'Test');