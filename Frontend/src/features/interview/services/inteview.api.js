import api from "../../../api.js";
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

    const response = await api.post("/api/interview", formData);

    return response.data;
};

/**
 * @description API service for retrieving an interview report by ID
 */

export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response.data;
}


/**
 * @description API service for retrieving all interview reports
 */

export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview");
    return response.data;
}

export const downloadInterviewReportPdf = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}/pdf`, {
        responseType: "blob",
    });
    return response.data;
};