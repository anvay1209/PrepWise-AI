require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

async function invokeGeminiAi() {
    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: "Hello, explain what an interview is.",
    });

    console.log(response.text);
}



const interviewReportSchema = z.object({ 
    matchScore: z.number().describe("The match score between the candidate's resume and the job description to show how well the profile matches the job requirements."), 

    technicalQuestions: z.array(z.object({ 
        question: z.string().describe("The technical question can be asked during the interview."),
        intention: z.string().describe("The intention ofinterviewer behind the technical question."),
        answer: z.string().describe("How to answer the technical question asked during the interview.")
     })).describe("Technical questions than can be asked during the interview."),

     behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked during the interview."),
        intention: z.string().describe("The intention of interviewer behind the behavioral question."),
        answer: z.string().describe("How to answer the behavioral question asked during the interview.") 

    })).describe("Behavioral questions than can be asked during the interview."),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill gap that the candidate needs to improve."),
        severity: z.string().describe("The severity of the skill gap.")
    })).describe("Skill gaps that the candidate needs to improve.") 
})





async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription,
}) {
    const prompt = ` Generate am interview report for a candidate with the following details.
                                      resume: ${resume}
                                      selfDescription: ${selfDescription}
                                      jobDescription: ${jobDescription}

`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(interviewReportSchema),
            },
        });
        const report = JSON.parse(response.text);
        return report;
    } catch (error) {
        console.error("Error generating interview report:",error);
        throw error;
    }
}

module.exports = {
    invokeGeminiAi,
    generateInterviewReport,
};