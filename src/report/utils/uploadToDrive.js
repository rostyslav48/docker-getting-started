const fs = require('fs');
const { google } = require('googleapis');
require('dotenv').config();

const EMAIL = process.env.CLIENT_EMAIL;
const KEY = process.env.PRIVATE_KEY.split(String.raw`\n`).join('\n');
const SCOPE = ['https://www.googleapis.com/auth/drive'];
const PARENTS = ['1K4hEkIPEtQqbPf2LqUWLXeGHvL9gK7q4'];

async function authorize() {
    const jwtClient = new google.auth.JWT(EMAIL, null, KEY, SCOPE);

    await jwtClient.authorize();

    return jwtClient;
}

async function uploadFile(authClient, fileIn, fileOut) {
    return new Promise((res, rej) => {
        const drive = google.drive({ version: 'v3', auth: authClient });

        const fileMetaData = {
            name: fileOut,
            parents: PARENTS,
        };

        drive.files.create({
            resource: fileMetaData,
            media: {
                body: fs.createReadStream(fileIn),
            },
            fields: 'id',
        }),
            (err, file) => {
                if (err) {
                    return rej(err);
                }

                return res(file);
            };
    });
}

async function uploadToDrive(fileIn, fileOut) {
    try {
        const jwtClient = await authorize();
        await uploadFile(jwtClient, fileIn, fileOut);
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    uploadToDrive,
};
