const mongoose = require('mongoose');



/**
 * - job description schema :string
 * - resume text schema :string
 * - self description :string
 * 
 * - matchScore ; Number
 * 
 * - Technical questions - [{
 *             question : " ",
 *             intesnion : " ",
 *             answer : " "
 * }]
 * - Behavioral questions - [{
 *            question : " ",
 *           intesnion : " ",
 *         answer : " "
 * }]
 * - Skill gaps : [{
 *           skill : " ",
 *           severity : " ",
 *           type : string,
 *           enum : ["Low", "Medium", "High"]}]
 * - prepration plan :{{
 *           day : number,
 *          task : " string",
 *          focus : string
 * }}
 */


const technicalQuestionSchema = new mongoose.Schema({
    question : {
        type : String,
        required : [true, "question is required"]
    },
    intention : {
        type : String,
        required : [true, "intention is required"]
    },
    answer : {
        type : String,
        required : [true, "answer is required"]
    }
},{
    _id : false
})

const behavioralQuestionSchema = new mongoose.Schema({    question : {
        type : String,
        required : [true, "question is required"]
    },
    intention : {
        type : String,
        required : [true, "intention is required"]
    },
    answer : {
        type : String,
        required : [true, "answer is required"]
    }
},{
    _id : false
})

const skillGapSchema = new mongoose.Schema({
    skill : {
        type : String,
        required : [true, "skill is required"]
    },
    severity : {
        type : String,
        required : [true, "severity is required"],
        enum : ["Low", "Medium", "High"]
    },
},{
    _id : false
})


const preparationPlanSchema = new mongoose.Schema({
    day : {
        type : Number,
        required : [true, "day is required"]
    },
    task : {
        type : String,
        required : [true, "task is required"]
    },
    focus : {
        type : String,
        required : [true, "focus is required"]
    }
})


const interviewReportSchema = new mongoose.Schema({
    jobDescription : {
        type : String,
        required : [true, "job description is required"]
    },
    resume : {
        type : String
    },
    selfDescription : {
        type : String
    },
    matchScore : {
        type : Number,
        min : 0,
        max : 100
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
},{
    timestamps : true
})

const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);

module.exports = interviewReportModel;