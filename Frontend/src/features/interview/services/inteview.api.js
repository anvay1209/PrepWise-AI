import axios from "axios";
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
    withCredentials: true,
});
/**
 * @description API service for generating interview reports
 */

export const generateInterviewReport = async (jobDescription, resume, selfDescription) => {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    if (resume) {
        formData.append("resume", resume);
    }
    formData.append("selfDescription", selfDescription);

    const response = await api.post("/interview", formData);

    return response.data;
};

/**
 * @description API service for retrieving an interview report by ID
 */

export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/interview/report/${interviewId}`);
    return response.data;
}


/**
 * @description API service for retrieving all interview reports
 */

export const getAllInterviewReports = async () => {
    const response = await api.get("/interview");
    return response.data;
}

export const downloadInterviewReportPdf = async (interviewId) => {
    const response = await api.get(`/interview/report/${interviewId}/pdf`, {
        responseType: "blob",
    });
    return response.data;
};