import mongoose from "mongoose"

const settingsSchema = new mongoose.Schema(
    {
        biranje_predmeta: {type: Boolean, required: true}
    }
)

export default mongoose.model('SettingsModel', settingsSchema, 'Settings');