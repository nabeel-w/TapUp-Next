/*eslint-disable*/
require('dotenv').config({ path: '.env.local' });
const fs = require('fs')
const path = require('path');


const serviceAccount = {
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_CERT_URL,
    universe_domain: process.env.UNIVERSE_DOMAIN,
};

const filePath = path.join(__dirname, 'credential.json');
fs.writeFileSync(filePath, JSON.stringify(serviceAccount, null, 2));

const envFilePath = path.resolve(__dirname, '../.env.local');
const newVariable = `GOOGLE_APPLICATION_CREDENTIALS="${filePath}"\n`;
fs.appendFile(envFilePath, newVariable, (err) => {
    if (err) {
        console.error('Error appending to .env.local:', err);
    } else {
        console.log('Successfully added new variable to .env.local');
    }
});

console.log("Credential file generated successfully");
