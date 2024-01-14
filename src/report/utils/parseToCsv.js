const fs = require('fs/promises');

const COLUMNS = ['imageName', 'CVE#', 'severity'];
const IMAGE_NAME = 'getting-started';
const SEVERITY = 'Severity';

async function getFile(fileIn) {
    const raw = await fs.readFile(fileIn);
    const parsedData = JSON.parse(raw);
    return parsedData;
}

function getSeverityValue(text) {
    const textArr = text.split('\n');
    const severityRow = textArr.find((row) => row.includes(SEVERITY));
    const severityValue = severityRow.split(':')[1];

    return severityValue.trim();
}

async function writeCsv(results, fileOut) {
    let csvContentRaw = [
        COLUMNS,
        ...results.map(({ ruleId, message }) => [
            IMAGE_NAME,
            ruleId,
            getSeverityValue(message.text),
        ]),
    ];

    const csvContent = csvContentRaw.map((e) => e.join(',')).join('\n');

    await fs.writeFile(fileOut, csvContent);
}

async function parseToCsv(fileIn, fileOut) {
    try {
        const report = await getFile(fileIn);
        await writeCsv(report.runs[0].results, fileOut);
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    parseToCsv,
};
