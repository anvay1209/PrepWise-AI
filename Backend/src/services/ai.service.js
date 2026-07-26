require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const googleApiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
const ai = new GoogleGenAI({
    apiKey: googleApiKey,
});

function extractMatchScore(value) {
    if (typeof value === "number") {
        return value;
    }

    if (typeof value === "string") {
        const text = value.trim();
        const percentMatch = text.match(/(\d+(?:\.\d+)?)\s*%/);
        if (percentMatch) {
            return Number(percentMatch[1]);
        }

        const numericMatch = text.match(/(\d+(?:\.\d+)?)/);
        if (numericMatch) {
            return Number(numericMatch[1]);
        }

        return 0;
    }

    if (value && typeof value === "object") {
        const fallbackValue = value.matchScore || value.score || value.match_score || value.value;
        return extractMatchScore(fallbackValue);
    }

    return 0;
}

function normalizeMatchScore(value) {
    const score = extractMatchScore(value);
    if (!Number.isFinite(score)) {
        return 0;
    }
    return Math.min(100, Math.max(0, score));
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    if (!googleApiKey) {
        throw new Error("GOOGLE_API_KEY is missing");
    }

    const prompt = `
Generate a complete interview report for a candidate.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Instructions:
- Return ONLY valid JSON.
- Do NOT include markdown, markdown fences, or extra text.
- Do NOT invent extra fields.
- Keep the structure precise and include all requested sections.
- Use the fields: title, matchScore, technicalQuestions, behavioralQuestions, skillGaps, preparationPlan, finalRecommendation.
- matchScore must be a numeric value between 0 and 100.
- technicalQuestions should be an array of 5 objects with question, intention, and answer.
- behavioralQuestions should be an array of 3 objects with question, intention, and answer.
- skillGaps should be an array of 3 to 5 objects with skill and severity.
- preparationPlan should be an array of 5 objects with day, task, and focus.

Example output format:
{
  "title": "Interview Readiness Report",
  "matchScore": 92,
  "technicalQuestions": [
    { "question": "...", "intention": "...", "answer": "..." },
    { "question": "...", "intention": "...", "answer": "..." },
    { "question": "...", "intention": "...", "answer": "..." },
    { "question": "...", "intention": "...", "answer": "..." },
    { "question": "...", "intention": "...", "answer": "..." }
  ],
  "behavioralQuestions": [
    { "question": "...", "intention": "...", "answer": "..." },
    { "question": "...", "intention": "...", "answer": "..." },
    { "question": "...", "intention": "...", "answer": "..." }
  ],
  "skillGaps": [
    { "skill": "...", "severity": "High" },
    { "skill": "...", "severity": "Medium" }
  ],
  "preparationPlan": [
    { "day": 1, "task": "...", "focus": "..." },
    { "day": 2, "task": "...", "focus": "..." },
    { "day": 3, "task": "...", "focus": "..." },
    { "day": 4, "task": "...", "focus": "..." },
    { "day": 5, "task": "...", "focus": "..." }
  ],
  "finalRecommendation": "..."
}
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
            config: {
                responseMimeType: "text/plain",
            },
        });

        const rawText = response.text || String(response?.candidates?.[0]?.content?.text || "");
        if (!rawText.trim()) {
            throw new Error("Empty response received from Gemini");
        }

        let rawReport = null;
        try {
            rawReport = JSON.parse(rawText);
        } catch (parseError) {
            const firstObject = rawText.indexOf("{");
            const lastObject = rawText.lastIndexOf("}");
            if (firstObject >= 0 && lastObject > firstObject) {
                try {
                    rawReport = JSON.parse(rawText.slice(firstObject, lastObject + 1));
                } catch (innerError) {
                    // ignore and log below
                }
            }
        }

        if (!rawReport) {
            console.error("Failed to parse Gemini response as JSON:", rawText);
            throw new Error("Failed to parse Gemini response");
        }

        rawReport.title = String(rawReport.title || "Interview Report");
        rawReport.matchScore = normalizeMatchScore(rawReport.matchScore);

        return rawReport;
    } catch (error) {
        console.error("Error generating interview report:", error);
        throw new Error("Failed to generate interview report");
    }
}

async function generateResumeFromGemini({
    resume,
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
}) {
    if (!googleApiKey) {
        throw new Error("GOOGLE_API_KEY is missing");
    }

    const candidateDetails = [];
    if (candidateName) candidateDetails.push(`Name: ${candidateName}`);
    if (candidateEmail) candidateDetails.push(`Email: ${candidateEmail}`);
    if (candidatePhone) candidateDetails.push(`Phone: ${candidatePhone}`);
    if (candidateLocation) candidateDetails.push(`Location: ${candidateLocation}`);
    if (candidateLinkedIn) candidateDetails.push(`LinkedIn: ${candidateLinkedIn}`);
    if (candidateGithub) candidateDetails.push(`GitHub: ${candidateGithub}`);
    if (candidatePortfolio) candidateDetails.push(`Portfolio: ${candidatePortfolio}`);
    if (targetJobTitle) candidateDetails.push(`Target Role: ${targetJobTitle}`);
    if (preferredStyle) candidateDetails.push(`Style Preference: ${preferredStyle}`);
    if (pageLimit) candidateDetails.push(`Page Limit: ${pageLimit}`);

    const candidateContext = candidateDetails.length
        ? `${candidateDetails.join(" | ")}\n\n`
        : "";

    const prompt = `You are an expert Resume Writer, ATS Resume Optimizer, Technical Recruiter, and Career Coach.

Your responsibility is to create a professional, ATS-friendly, modern resume tailored specifically to the provided Job Description while preserving factual accuracy.

The candidate has provided an existing resume document, an optional self description, and a target job description.

${candidateContext}Resume Content:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Instructions:
1. Extract every useful detail from the existing resume content. Preserve facts and do not invent education, work experience, certifications, awards, projects, or company names.
2. If a field is missing from the resume, omit it from the result. Do not leave empty headings or placeholder sections.
3. If the resume includes social links, portfolio links, or website references, extract them accurately.
4. Use the job description to identify required and preferred skills, keywords, domain language, and role expectations.
5. Reorganize and improve the resume for ATS compatibility and recruiter readability.
6. Improve grammar, clarity, and bullet language while keeping all achievements factually consistent with the original resume content.
7. Do not fabricate numeric metrics unless they are explicitly present in the original resume.
8. Produce a clean single-column resume structure.
9. Provide the final resume strictly as JSON only. Do not include markdown fences, explanatory text, or any extra output.
10. Use the exact JSON schema shown below.

{
  "personalInformation": {
    "fullName": "",
    "professionalTitle": "",
    "email": "",
    "phone": "",
    "linkedIn": "",
    "github": "",
    "portfolio": "",
    "website": "",
    "location": ""
  },
  "professionalSummary": "",
  "skills": {
    "programmingLanguages": [],
    "frontend": [],
    "backend": [],
    "databases": [],
    "cloud": [],
    "devOps": [],
    "machineLearning": [],
    "ai": [],
    "tools": [],
    "softSkills": []
  },
  "experience": [],
  "projects": [],
  "education": [],
  "certifications": [],
  "achievements": [],
  "leadership": [],
  "volunteerExperience": [],
  "publications": [],
  "languages": [],
  "codingProfiles": [],
  "additionalSections": [],
  "atsKeywordsUsed": [],
  "overallATSScore": 0,
  "suggestions": [],
  "resumeMetadata": {
    "recommendedPages": 1,
    "theme": "Modern ATS",
    "targetRole": "",
    "experienceLevel": ""
  }
}

The JSON should only include sections present in the actual resume. If a category has no content, return it as an empty array or an empty string, but keep the overall structure intact.

Set "resumeMetadata.targetRole" to the target job title or the most relevant role from the job description.
Set "resumeMetadata.experienceLevel" based on the candidate's background.
Set "overallATSScore" to a number between 0 and 100.
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
            config: {
                responseMimeType: "text/plain",
            },
        });

        const rawText = response.text || String(response?.candidates?.[0]?.content?.text || "");
        if (!rawText.trim()) {
            throw new Error("Empty response received from Gemini");
        }

        let rawJson = null;
        try {
            rawJson = JSON.parse(rawText);
        } catch (parseError) {
            const firstObject = rawText.indexOf("{");
            const lastObject = rawText.lastIndexOf("}");
            if (firstObject >= 0 && lastObject > firstObject) {
                try {
                    rawJson = JSON.parse(rawText.slice(firstObject, lastObject + 1));
                } catch (innerError) {
                    // continue to error below
                }
            }
        }

        if (!rawJson || typeof rawJson !== "object") {
            console.error("Failed to parse Gemini resume JSON:", rawText);
            throw new Error("Failed to parse Gemini resume JSON");
        }

        if (rawJson.resumeMetadata && !rawJson.resumeMetadata.targetRole && targetJobTitle) {
            rawJson.resumeMetadata.targetRole = targetJobTitle;
        }

        return rawJson;
    } catch (error) {
        console.error("Error generating resume:", error);
        throw new Error("Failed to generate resume");
    }
}

module.exports = {
    generateInterviewReport,
    generateResumeFromGemini,
};
