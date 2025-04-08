import mongoose from "mongoose"

const adminSchema = new mongoose.Schema(
    {
        kor_ime: String,
        lozinka: String,
        uloga: String
    }
)

export default mongoose.model('AdminModel', adminSchema, 'admin');