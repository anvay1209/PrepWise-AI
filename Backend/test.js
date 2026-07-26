require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
const ai = new GoogleGenAI({
    apiKey,
});

async function testGemini() {
    const prompt = `
Generate an interview report.

Candidate:

- Name: John Doe
- Skills: React, Node.js, MongoDB, Express, Docker
- Experience: Built 3 full-stack projects.

Job:

Software Engineer

Return ONLY valid JSON in this format:

{
    "matchScore": 0,

    "technicalQuestions": [
        {
            "question": "",
            "intention": "",
            "answer": ""
        }
    ],

    "behavioralQuestions": [
        {
            "question": "",
            "intention": "",
            "answer": ""
        }
    ],

    "skillGaps": [
        {
            "skill": "",
            "severity": "Low"
        }
    ],

    "preparationPlan": [
        {
            "day": 1,
            "task": "",
            "focus": ""
        }
    ]
}
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
        });

        console.log("\n=== RAW RESPONSE ===\n");
        console.log(response.text);

        const report = JSON.parse(response.text);

        console.log("\n=== PARSED JSON ===\n");
        console.log(
            JSON.stringify(report, null, 2)
        );
    } catch (error) {
        console.error(error);
    }
}

testGemini();