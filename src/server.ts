const fs = require('fs');
const nodeCrypto = require('crypto');
const path = require('path');
require('dotenv').config(); 

const rootEnvPath = path.join(__dirname, '..', '..', '.env'); 


if (!process.env['JWT_SECRET']) {
    let secretKey;

    if (fs.existsSync(rootEnvPath)) {
        require('dotenv').config({ path: rootEnvPath });

        if (process.env['JWT_SECRET']) {
            secretKey = process.env['JWT_SECRET'];
        }
    }

    if (!secretKey) {
        secretKey = nodeCrypto.randomBytes(32).toString('hex');
        fs.appendFileSync(rootEnvPath, `JWT_SECRET=${secretKey}\n`);
        console.log('Generisan i upisan novi JWT_SECRET u .env fajl');
    }
}
// npx ts-node src/server.ts