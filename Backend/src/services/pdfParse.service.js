const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");

async function parseResume(buffer, mimeType = "application/pdf") {
    const fileType = String(mimeType || "").toLowerCase();

    if (fileType.includes("wordprocessingml.document") || fileType.includes("msword") || fileType.includes("docx")) {
        const result = await mammoth.extractRawText({ buffer });
        const extractedText = result?.value || "";
        if (!extractedText.trim()) {
            throw new Error("Unable to extract text from resume DOCX");
        }
        return extractedText;
    }

    if (fileType.includes("text") || fileType.includes("plain")) {
        const extractedText = buffer.toString("utf8");
        if (!extractedText.trim()) {
            throw new Error("Unable to extract text from resume file");
        }
        return extractedText;
    }

    const parser = new PDFParse({ data: buffer });
    let parsedResult;
    try {
        parsedResult = await parser.getText();
    } finally {
        await parser.destroy();
    }

    const extractedText =
        typeof parsedResult === "string"
            ? parsedResult
            : parsedResult?.text;

    if (!extractedText || !extractedText.trim()) {
        throw new Error("Unable to extract text from resume PDF");
    }

    return extractedText;
}

module.exports = parseResume;