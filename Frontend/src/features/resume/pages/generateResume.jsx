import React, { useEffect, useRef, useState } from "react";
import { generateResume, getAllResumes, downloadResumePdf } from "../services/resume.api.js";
import "../style/generateResume.scss";

const GenerateResume = () => {
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidatePhone, setCandidatePhone] = useState("");
  const [candidateLocation, setCandidateLocation] = useState("");
  const [candidateLinkedIn, setCandidateLinkedIn] = useState("");
  const [candidateGithub, setCandidateGithub] = useState("");
  const [candidatePortfolio, setCandidatePortfolio] = useState("");
  const [targetJobTitle, setTargetJobTitle] = useState("");
  const [preferredStyle, setPreferredStyle] = useState("Modern ATS");
  const [pageLimit, setPageLimit] = useState("1");
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    getAllResumes().then((response) => {
      setResumes(response.data || []);
    }).catch(() => {});
  }, []);

  const handleResumeUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setResumeFileName(file ? file.name : "");
    setSuccessMessage("");
  };

  const handleGenerateResume = async () => {
    setSubmitError("");
    setSuccessMessage("");

    if (!jobDescription.trim()) {
      setSubmitError("Job description is required.");
      return;
    }

    if (!selectedFile) {
      setSubmitError("Please upload your current resume.");
      return;
    }

    setLoading(true);
    try {
      const result = await generateResume(
        jobDescription,
        selectedFile,
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
          Number(pageLimit) || 1
        );
      setSuccessMessage("Your AI resume was generated and saved successfully.");
      setResumes((previous) => [result.data, ...previous]);
      setSelectedFile(null);
      setResumeFileName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setSubmitError(error.response?.data?.message || error.message || "Failed to generate resume.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (resumeId) => {
    try {
      const blob = await downloadResumePdf(resumeId);
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `ai-resume-${resumeId}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setSubmitError("Unable to download resume PDF.");
    }
  };

  return (
    <main className="resume-page">
      <section className="resume-hero">
        <div>
          <p className="eyebrow">AI Resume Builder</p>
          <h1>Build a stronger resume for the role you want.</h1>
          <p>Upload your current resume, add the job description, and let PrepWise AI write a modern resume tailored to the opportunity.</p>
        </div>
      </section>

      <section className="resume-panel">
        <div className="resume-form">
          <div className="panel-heading">
            <h2>Resume Input</h2>
            <p>Upload your resume and describe your target job for the best results.</p>
          </div>

          <div className="input-row">
            <div className="input-group small">
              <label htmlFor="candidateName">Full Name</label>
              <input
                id="candidateName"
                name="candidateName"
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div className="input-group small">
              <label htmlFor="candidateEmail">Email</label>
              <input
                id="candidateEmail"
                name="candidateEmail"
                type="email"
                value={candidateEmail}
                onChange={(e) => setCandidateEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group small">
              <label htmlFor="candidateLocation">Location</label>
              <input
                id="candidateLocation"
                name="candidateLocation"
                type="text"
                value={candidateLocation}
                onChange={(e) => setCandidateLocation(e.target.value)}
                placeholder="City, Country"
              />
            </div>
            <div className="input-group small">
              <label htmlFor="candidateLinkedIn">LinkedIn</label>
              <input
                id="candidateLinkedIn"
                name="candidateLinkedIn"
                type="text"
                value={candidateLinkedIn}
                onChange={(e) => setCandidateLinkedIn(e.target.value)}
                placeholder="linkedin.com/in/username"
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group small">
              <label htmlFor="candidatePhone">Phone</label>
              <input
                id="candidatePhone"
                name="candidatePhone"
                type="text"
                value={candidatePhone}
                onChange={(e) => setCandidatePhone(e.target.value)}
                placeholder="+1 234 567 890"
              />
            </div>
            <div className="input-group small">
              <label htmlFor="candidateGithub">GitHub</label>
              <input
                id="candidateGithub"
                name="candidateGithub"
                type="text"
                value={candidateGithub}
                onChange={(e) => setCandidateGithub(e.target.value)}
                placeholder="github.com/username"
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group small">
              <label htmlFor="candidatePortfolio">Portfolio / Website</label>
              <input
                id="candidatePortfolio"
                name="candidatePortfolio"
                type="text"
                value={candidatePortfolio}
                onChange={(e) => setCandidatePortfolio(e.target.value)}
                placeholder="portfolio.com or personal website"
              />
            </div>
            <div className="input-group small">
              <label htmlFor="targetJobTitle">Target Role</label>
              <input
                id="targetJobTitle"
                name="targetJobTitle"
                type="text"
                value={targetJobTitle}
                onChange={(e) => setTargetJobTitle(e.target.value)}
                placeholder="Full Stack Developer, Data Scientist..."
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group small">
              <label htmlFor="preferredStyle">Resume Style</label>
              <select
                id="preferredStyle"
                name="preferredStyle"
                value={preferredStyle}
                onChange={(e) => setPreferredStyle(e.target.value)}
              >
                <option value="Modern ATS">Modern ATS</option>
                <option value="Professional">Professional</option>
                <option value="Minimal">Minimal</option>
              </select>
            </div>
            <div className="input-group small">
              <label htmlFor="pageLimit">Preferred Page Limit</label>
              <select
                id="pageLimit"
                name="pageLimit"
                value={pageLimit}
                onChange={(e) => setPageLimit(e.target.value)}
              >
                <option value="1">1 Page</option>
                <option value="2">2 Pages</option>
              </select>
            </div>
          </div>

          <div className="input-group file-group">
            <label htmlFor="resume">Upload Current Resume</label>
            <div className="upload-box" onClick={() => fileInputRef.current?.click()}>
              <div className="upload-icon">☁</div>
              <div>
                <h4>{resumeFileName || "Click to upload your PDF"}</h4>
                <p>{resumeFileName ? "Resume ready to generate" : "PDF, DOCX, or TXT, max 10MB"}</p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              id="resume"
              accept=".pdf,.docx,.txt"
              hidden
              onChange={handleResumeUpload}
            />
          </div>

          <div className="input-group">
            <label htmlFor="jobDescription">Job Description</label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description here..."
            />
          </div>

          <div className="input-group">
            <label htmlFor="selfDescription">Quick Self Description</label>
            <textarea
              id="selfDescription"
              name="selfDescription"
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
              placeholder="Briefly describe your skills, experience, and goals..."
            />
          </div>

          {submitError && <div className="error-message">{submitError}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          <button className="primary-btn" onClick={handleGenerateResume} disabled={loading}>
            {loading ? "Generating resume..." : "Generate AI Resume"}
          </button>
        </div>

        <aside className="resume-history">
          <div className="panel-heading">
            <h2>Saved Resumes</h2>
            <p>Downloaded resumes are stored and ready to review.</p>
          </div>

          {resumes.length === 0 ? (
            <div className="empty-state">No AI resumes generated yet.</div>
          ) : (
            <div className="resume-list">
              {resumes.map((item) => (
                <article key={item._id} className="resume-card">
                  <h3>{item.title || "AI Resume"}</h3>
                  <span>{new Date(item.createdAt).toLocaleString()}</span>
                  <p>{item.jobDescription?.slice(0, 120)}...</p>
                  <button onClick={() => handleDownload(item._id)}>Download PDF</button>
                </article>
              ))}
            </div>
          )}
        </aside>
      </section>
    </main>
  );
};

export default GenerateResume;
