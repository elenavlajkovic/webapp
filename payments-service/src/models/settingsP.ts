import mongoose from "mongoose"

const settingsPSchema = new mongoose.Schema(
    {
        rok_prva_rata: {type: Date, default: true},
        rok_druga_rata: {type: Date, default: true},
        rok_treca_rata: {type: Date, default: true},
        rok_cetvrta_rata: {type: Date, default: true},
        cena_1_ESPB: {type: Number, default: 4000}
    }
)

export default mongoose.model('SettingsPModel', settingsPSchema, 'SettingsP');