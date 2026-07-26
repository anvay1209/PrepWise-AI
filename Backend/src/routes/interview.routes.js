const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const { singleResumeUpload } = require("../middlewares/file.middleware");

const interviewRouter = express.Router();

/**
 * @route POST /api/interview
 * @description Generate an interview report based on the candidate's resume, self-description, and job description.
 * @access Private
 */
interviewRouter.post("/", authMiddleware.authUser, singleResumeUpload, interviewController.generateInterviewReport);


/**
 * @route GET /api/interview/report/:interviewId
 * @description Get an interview report by ID.
 * @access Private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportById);
interviewRouter.get("/report/:interviewId/pdf", authMiddleware.authUser, interviewController.downloadInterviewReportPdf);


/**
 * @route GET /api/interview
 * @description Get all interview reports for the authenticated user.
 * @access Private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReports);



module.exports = interviewRouter;