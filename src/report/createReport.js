const { parseToCsv } = require('./utils/parseToCsv');
const { uploadToDrive } = require('./utils/uploadToDrive');

const FILE_IN_CSV = 'security-report.json';
const FILE_OUT_CSV = 'security-report.csv';
const FILE_IN_DRIVE = 'security-report.csv';
const FILE_OUT_DRIVE = 'Vulnerabilities.csv';

async function createReport() {
    await parseToCsv(FILE_IN_CSV, FILE_OUT_CSV);
    uploadToDrive(FILE_IN_DRIVE, FILE_OUT_DRIVE);
}

createReport();
