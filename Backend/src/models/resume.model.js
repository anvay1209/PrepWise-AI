const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  originalResumeText: {
    type: String,
    default: "",
  },
  resumeFile: {
    type: Buffer,
  },
  resumeFileMimeType: {
    type: String,
    default: "application/pdf",
  },
  targetJobTitle: {
    type: String,
    default: "",
  },
  candidateName: {
    type: String,
    default: "",
  },
  candidateEmail: {
    type: String,
    default: "",
  },
  candidatePhone: {
    type: String,
    default: "",
  },
  candidateLocation: {
    type: String,
    default: "",
  },
  candidateLinkedIn: {
    type: String,
    default: "",
  },
  candidateGithub: {
    type: String,
    default: "",
  },
  candidatePortfolio: {
    type: String,
    default: "",
  },
  preferredStyle: {
    type: String,
    default: "Modern ATS",
  },
  pageLimit: {
    type: Number,
    default: 1,
  },
  jobDescription: {
    type: String,
    required: [true, "Job description is required"],
  },
  selfDescription: {
    type: String,
    default: "",
  },
  generatedResumeText: {
    type: String,
    default: "",
  },
  generatedResumeJson: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  generatedResumePdf: {
    type: Buffer,
  },
  generatedResumePdfMimeType: {
    type: String,
    default: "application/pdf",
  },
  title: {
    type: String,
    default: "AI Resume",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, {
  timestamps: true,
});

const ResumeModel = mongoose.model("Resume", resumeSchema);

module.exports = ResumeModel;
