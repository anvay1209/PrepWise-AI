const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const resumeController = require("../controllers/resume.controller");
const { singleResumeUpload } = require("../middlewares/file.middleware");

const resumeRouter = express.Router();

resumeRouter.post("/", authMiddleware.authUser, singleResumeUpload, resumeController.generateResume);
resumeRouter.get("/", authMiddleware.authUser, resumeController.getAllResumes);
resumeRouter.get("/:resumeId", authMiddleware.authUser, resumeController.getResumeById);
resumeRouter.get("/:resumeId/pdf", authMiddleware.authUser, resumeController.downloadResumePdf);
resumeRouter.get("/from-report/:reportId/pdf", authMiddleware.authUser, resumeController.generateResumeFromReport);
resumeRouter.get("/update_resume/:reportId/pdf", authMiddleware.authUser, resumeController.generateResumeFromReport);

module.exports = resumeRouter;
