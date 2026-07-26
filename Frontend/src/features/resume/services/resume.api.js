import api from "../../../api.js";

export const generateResume = async (
  jobDescription,
  resume,
  selfDescription,
  candidateName,
  candidateEmail,
  candidatePhone,
  candidateLocation,
  candidateLinkedIn,
  candidateGithub,
  candidatePortfolio,
  targetJobTitle,
  preferredStyle,
  pageLimit
) => {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);
  formData.append("candidateName", candidateName);
  formData.append("candidateEmail", candidateEmail);
  formData.append("candidatePhone", candidatePhone);
  formData.append("candidateLocation", candidateLocation);
  formData.append("candidateLinkedIn", candidateLinkedIn);
  formData.append("candidateGithub", candidateGithub);
  formData.append("candidatePortfolio", candidatePortfolio);
  formData.append("targetJobTitle", targetJobTitle);
  formData.append("preferredStyle", preferredStyle);
  formData.append("pageLimit", String(pageLimit));
  if (resume) {
    formData.append("resume", resume);
  }

  const response = await api.post("/api/resume", formData);
  return response.data;
};

export const getAllResumes = async () => {
  const response = await api.get("/api/resume");
  return response.data;
};

export const downloadResumePdf = async (resumeId) => {
  const response = await api.get(`/api/resume/${resumeId}/pdf`, {
    responseType: "blob",
  });
  return response.data;
};

export const downloadUpdatedResumeFromReport = async (reportId) => {
  const response = await api.get(`/api/resume/update_resume/${reportId}/pdf`, {
    responseType: "blob",
  });
  return response.data;
};