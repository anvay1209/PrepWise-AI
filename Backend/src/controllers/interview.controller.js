const parsePdfResume = require("../services/pdfParse.service");
const { generateInterviewReport: generateInterviewReportWithGemini } = require("../services/ai.service");
const { createInterviewReportPdf } = require("../services/reportPdf.service");
const interviewReportModel = require("../models/interviewReport.model");

function normalizeSeverity(value) {
    const normalized = String(value || "medium").toLowerCase();
    if (normalized === "high") {
        return "High";
    }
    if (normalized === "low") {
        return "Low";
    }
    return "Medium";
}

function normalizeSkillGaps(skillGaps) {
    if (!Array.isArray(skillGaps)) {
        return [];
    }

    return skillGaps
        .map((gap) => {
            if (typeof gap === "string") {
                const skill = gap.trim();
                if (!skill) {
                    return null;
                }
                return { skill, severity: "Medium" };
            }
            if (!gap || typeof gap !== "object") {
                return null;
            }
            const skill = String(gap.skill || "").trim();
            if (!skill) {
                return null;
            }
            return {
                skill,
                severity: normalizeSeverity(gap.severity),
            };
        })
        .filter(Boolean);
}

async function generateInterviewReport(req, res) {
    try {
        const resumeFile = req.file;
        const { selfDescription = "", jobDescription = "" } = req.body || {};

        if (!jobDescription.trim()) {
            return res.status(400).json({
                success: false,
                message: "Job description is required",
            });
        }

        if (!resumeFile && !selfDescription.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please provide either a resume PDF or a self description.",
            });
        }

        const resumeText = resumeFile ? await parsePdfResume(resumeFile.buffer) : "";

        const aiReport = await generateInterviewReportWithGemini({
            resume: resumeText,
            selfDescription,
            jobDescription,
        });

        const normalizedReport = {
            title: aiReport.title || "Interview Report",
            matchScore: Number(String(aiReport.matchScore || 0).replace("%", "")),
            technicalQuestions: Array.isArray(aiReport.technicalQuestions) ? aiReport.technicalQuestions : [],
            behavioralQuestions: Array.isArray(aiReport.behavioralQuestions) ? aiReport.behavioralQuestions : [],
            skillGaps: normalizeSkillGaps(aiReport.skillGaps),
            preparationPlan: Array.isArray(aiReport.preparationPlan) ? aiReport.preparationPlan : [],
            finalRecommendation: aiReport.finalRecommendation || "",
        };

        const reportPdf = await createInterviewReportPdf(normalizedReport);

        const interviewReport = await interviewReportModel.create({
            user: req.user?.id || req.user?._id,
            resume: resumeText,
            resumeFile: resumeFile?.buffer,
            resumeFileMimeType: resumeFile?.mimetype || "application/pdf",
            selfDescription,
            jobDescription,
            reportPdf,
            reportPdfMimeType: "application/pdf",
            ...normalizedReport,
        });

        return res.status(201).json({
            success: true,
            message: "Interview report generated successfully",
            data: interviewReport,
        });
    } catch (error) {
        console.error("Generate interview report error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
}

async function getInterviewReportById(req, res) {
    try {
        const { interviewId } = req.params;
        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user?.id || req.user?._id,
        });

        if (!interviewReport) {
            return res.status(404).json({
                success: false,
                message: "Interview report not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Interview report retrieved successfully",
            data: interviewReport,
        });
    } catch (error) {
        console.error("Get interview report by id error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
}

async function getAllInterviewReports(req, res) {
    try {
        const interviewReports = await interviewReportModel
            .find({ user: req.user?.id || req.user?._id })
            .sort({ createdAt: -1 })
            .select("-resume -resumeFile -reportPdf -selfDescription -jobDescription -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan -__v");

        return res.status(200).json({
            success: true,
            message: "Interview reports retrieved successfully",
            data: interviewReports,
        });
    } catch (error) {
        console.error("Get all interview reports error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
}

async function downloadInterviewReportPdf(req, res) {
    try {
        const { interviewId } = req.params;
        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user?.id || req.user?._id,
        }).select("reportPdf reportPdfMimeType title");

        if (!interviewReport || !interviewReport.reportPdf) {
            return res.status(404).json({
                success: false,
                message: "Interview report PDF not found",
            });
        }

        res.setHeader("Content-Type", interviewReport.reportPdfMimeType || "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${String(interviewReport.title || "interview-report").replace(/[^a-z0-9-_]/gi, "_")}.pdf"`
        );

        return res.send(interviewReport.reportPdf);
    } catch (error) {
        console.error("Download interview report pdf error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
}

module.exports = {
    generateInterviewReport,
    getInterviewReportById,
    getAllInterviewReports,
    downloadInterviewReportPdf,
};