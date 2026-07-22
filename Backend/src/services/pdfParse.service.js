const { PDFParse } = require("pdf-parse");

async function parsePdfResume(buffer) {
    const parser = new PDFParse({ data: buffer });
    let data;
    try {
        data = await parser.getText();
    } finally {
        await parser.destroy();
    }

    return data.text;
}

module.exports = parsePdfResume;