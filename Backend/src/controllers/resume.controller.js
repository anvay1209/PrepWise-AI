const parseResume = require("../services/pdfParse.service");
const {
  generateResumeFromGemini,
} = require("../services/ai.service");
const { createResumePdf } = require("../services/resumePdf.service");
const ResumeModel = require("../models/resume.model");
const InterviewReportModel = require("../models/interviewReport.model");

async function generateResume(req, res) {
  try {
    const resumeFile = req.file;
    const {
      targetJobTitle = "",
      selfDescription = "",
      jobDescription = "",
      candidateName = "",
      candidateEmail = "",
      candidatePhone = "",
      candidateLocation = "",
      candidateLinkedIn = "",
      candidateGithub = "",
      candidatePortfolio = "",
      preferredStyle = "Modern ATS",
      pageLimit = 1,
    } = req.body || {};

    if (!jobDescription.trim()) {
      return res.status(400).json({
        success: false,
        message: "Job description is required",
      });
    }

    if (!resumeFile) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    const resumeText = await parseResume(resumeFile.buffer, resumeFile.mimetype);
    const generatedResume = await generateResumeFromGemini({
      resume: resumeText,
      targetJobTitle,
      selfDescription,
      jobDescription,
      candidateName,
      candidateEmail,
      candidatePhone,
      candidateLocation,
      candidateLinkedIn,
      candidateGithub,
      candidatePortfolio,
      preferredStyle,
      pageLimit,
    });

    const resumePdf = await createResumePdf(generatedResume);

    const resumeRecord = await ResumeModel.create({
      user: req.user?.id || req.user?._id,
      originalResumeText: resumeText,
      resumeFile: resumeFile.buffer,
      resumeFileMimeType: resumeFile.mimetype || "application/pdf",
      targetJobTitle,
      selfDescription,
      jobDescription,
      candidateName,
      candidateEmail,
      candidatePhone,
      candidateLocation,
      candidateLinkedIn,
      candidateGithub,
      candidatePortfolio,
      preferredStyle,
      pageLimit: Number(pageLimit) || 1,
      generatedResumeText: JSON.stringify(generatedResume, null, 2),
      generatedResumeJson: generatedResume,
      generatedResumePdf: resumePdf,
      title: generatedResume?.personalInformation?.fullName
        ? `${generatedResume.personalInformation.fullName} - AI Resume`
        : "AI Resume",
    });

    return res.status(201).json({
      success: true,
      message: "Resume generated successfully",
      data: resumeRecord,
    });
  } catch (error) {
    console.error("Generate resume error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
}

async function getAllResumes(req, res) {
  try {
    const resumes = await ResumeModel.find({ user: req.user?.id || req.user?._id })
      .sort({ createdAt: -1 })
      .select("title createdAt jobDescription generatedResumeText");

    return res.status(200).json({
      success: true,
      message: "Resumes retrieved successfully",
      data: resumes,
    });
  } catch (error) {
    console.error("Get all resumes error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
}

async function getResumeById(req, res) {
  try {
    const { resumeId } = req.params;
    const resume = await ResumeModel.findOne({
      _id: resumeId,
      user: req.user?.id || req.user?._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume retrieved successfully",
      data: resume,
    });
  } catch (error) {
    console.error("Get resume by id error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
}

async function downloadResumePdf(req, res) {
  try {
    const { resumeId } = req.params;
    const resume = await ResumeModel.findOne({
      _id: resumeId,
      user: req.user?.id || req.user?._id,
    }).select("generatedResumePdf generatedResumePdfMimeType title");

    if (!resume || !resume.generatedResumePdf) {
      return res.status(404).json({
        success: false,
        message: "Resume PDF not found",
      });
    }

    res.setHeader("Content-Type", resume.generatedResumePdfMimeType || "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${String(resume.title || "ai-resume").replace(/[^a-z0-9-_]/gi, "_")}.pdf"`
    );

    return res.send(resume.generatedResumePdf);
  } catch (error) {
    console.error("Download resume pdf error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
}

async function generateResumeFromReport(req, res) {
  try {
    const { reportId } = req.params;
    const report = await InterviewReportModel.findOne({
      _id: reportId,
      user: req.user?.id || req.user?._id,
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Interview report not found",
      });
    }

    const generatedResume = await generateResumeFromGemini({
      resume: report.resume || "",
      selfDescription: report.selfDescription || "",
      jobDescription: report.jobDescription || "",
    });

    const resumePdf = await createResumePdf(generatedResume);

    const resumeRecord = await ResumeModel.create({
      user: req.user?.id || req.user?._id,
      originalResumeText: report.resume || "",
      resumeFile: report.resumeFile,
      resumeFileMimeType: report.resumeFileMimeType || "application/pdf",
      selfDescription: report.selfDescription || "",
      jobDescription: report.jobDescription || "",
      generatedResumeText: JSON.stringify(generatedResume, null, 2),
      generatedResumeJson: generatedResume,
      generatedResumePdf: resumePdf,
      title: `AI Resume for ${report.title || "Interview Report"}`,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${String(resumeRecord.title || "ai-resume").replace(/[^a-z0-9-_]/gi, "_")}.pdf"`
    );

    return res.send(resumePdf);
  } catch (error) {
    console.error("Generate resume from report error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
}

module.exports = {
  generateResume,
  getAllResumes,
  getResumeById,
  downloadResumePdf,
  generateResumeFromReport,
};
