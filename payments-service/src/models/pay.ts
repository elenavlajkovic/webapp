import mongoose from "mongoose"

const paySchema = new mongoose.Schema(
    {
        kor_ime: String,
        iznos: String,
        datum_uplate: Date
    }
)

export default mongoose.model('PayModel', paySchema, 'Pay');