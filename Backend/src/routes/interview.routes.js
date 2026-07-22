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


module.exports = interviewRouter;