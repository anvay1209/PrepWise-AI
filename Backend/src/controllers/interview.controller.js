const parsePdfResume = require("../services/pdfParse.service");

const {
    generateInterviewReport: generateInterviewReportWithGemini,
} = require("../services/ai.service");

const interviewReportModel = require("../models/interviewReport.model");

async function generateInterviewReport(req, res) {
    try {
        const resumeFile = req.file;

        const { selfDescription, jobDescription } = req.body || {};

        // Validation

        if (!resumeFile) {
            return res.status(400).json({
                success: false,
                message: "Resume file is required",
            });
        }

        if (!selfDescription || !jobDescription) {
            return res.status(400).json({
                success: false,
                message:
                    "Self description and job description are required",
            });
        }

        // Parse PDF

        const resumeContent = await parsePdfResume(
            resumeFile.buffer
        );

        // Generate AI report

        const interviewReportByAI =
            await generateInterviewReportWithGemini({
                resume: resumeContent,
                selfDescription,
                jobDescription,
            });

        // Save report to MongoDB

        const interviewReport =
            await interviewReportModel.create({
                user: req.user?.id || req.user?._id,
                resume: resumeContent,
                selfDescription,
                jobDescription,
                ...interviewReportByAI,
            });

        return res.status(200).json({
            success: true,
            message: "Interview report generated successfully",
            data: interviewReport,
        });
    } catch (error) {
        console.error(
            "Generate interview report error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Internal server error generating interview report",
        });
    }
}

module.exports = {
    generateInterviewReport,
};