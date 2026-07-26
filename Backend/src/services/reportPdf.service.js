const PDFDocument = require("pdfkit");

function writeSectionTitle(doc, title) {
    doc.moveDown(0.5);
    doc.fontSize(16).fillColor("#1d4ed8").text(title);
    doc.moveDown(0.3);
    doc.fillColor("#111827").fontSize(11);
}

function createInterviewReportPdf(report) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 40, size: "A4" });
        const buffers = [];

        doc.on("data", (chunk) => buffers.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(buffers)));
        doc.on("error", reject);

        doc.fontSize(22).fillColor("#111827").text(report.title || "Interview Report");
        doc.moveDown(0.5);
        doc.fontSize(12).fillColor("#374151").text(`Match Score: ${report.matchScore}%`);
        doc.moveDown();

        writeSectionTitle(doc, "Skill Gaps");
        (report.skillGaps || []).forEach((gap, index) => {
            doc.text(`${index + 1}. ${gap.skill} (${gap.severity})`);
        });

        writeSectionTitle(doc, "Technical Questions");
        (report.technicalQuestions || []).forEach((question, index) => {
            doc.font("Helvetica-Bold").text(`${index + 1}. ${question.question}`);
            doc.font("Helvetica").text(`Intention: ${question.intention}`);
            doc.text(`Answer: ${question.answer}`);
            doc.moveDown(0.5);
        });

        writeSectionTitle(doc, "Behavioral Questions");
        (report.behavioralQuestions || []).forEach((question, index) => {
            doc.font("Helvetica-Bold").text(`${index + 1}. ${question.question}`);
            doc.font("Helvetica").text(`Intention: ${question.intention}`);
            doc.text(`Answer: ${question.answer}`);
            doc.moveDown(0.5);
        });

        writeSectionTitle(doc, "5-Day Preparation Plan");
        (report.preparationPlan || []).forEach((plan) => {
            doc.text(`Day ${plan.day}: ${plan.focus}`);
            doc.text(`Task: ${plan.task}`);
            doc.moveDown(0.5);
        });

        writeSectionTitle(doc, "Final Recommendation");
        doc.text(report.finalRecommendation || "No recommendation available.");

        doc.end();
    });
}

module.exports = { createInterviewReportPdf };
