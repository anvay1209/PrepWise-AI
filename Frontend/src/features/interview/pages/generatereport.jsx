import React, { useEffect, useRef, useState } from "react";
import "../style/generatereport.scss";
import { useInterview } from "../hooks/useinterview";
import { useNavigate } from "react-router-dom";


const GenerateReport = () => {
    const { loading, error, reports, generateReport, getAllReports, downloadPdf } = useInterview();
    const navigate = useNavigate();
    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const resumeInputRef = useRef(null);
    const [resumeFileName, setResumeFileName] = useState("");
    const [submitError, setSubmitError] = useState("");

    useEffect(() => {
        getAllReports().catch(() => {});
    }, [getAllReports]);

    const handleGenerateReport = async () => {
        setSubmitError("");
        const resumeFile = resumeInputRef.current.files[0];

        if (!jobDescription.trim()) {
            setSubmitError("Job description is required.");
            return;
        }
        if (!resumeFile && !selfDescription.trim()) {
            setSubmitError("Please provide either a resume PDF or a self description.");
            return;
        }

        try {
            const data = await generateReport(jobDescription, resumeFile, selfDescription);
            if (data?._id) {
                navigate(`/interview/report/${data._id}`);
            }
        } catch (requestError) {
            setSubmitError(requestError.response?.data?.message || requestError.message || "Failed to generate report.");
        }
    };

if (loading) {
    return (
        <main className="loading-screen">
            <div className="loading-content">
                <h1>Loading results...</h1>
                <p>
                    Generating your personalized interview report.
                    <br />
                    This may take a few moments.
                </p>
            </div>
        </main>
    );
}

    return (
        <main className="home">

            <div className="hero">

                <h1>
                    Create Your Custom{" "}
                    <span>Interview Plan</span>
                </h1>

                <p className="subtitle">
                    Let our AI analyze the job requirements and your unique profile to
                    build a winning interview strategy.
                </p>

            </div>

            <div className="interview-input-group">

                {/* Left Panel */}

                <div className="left panel">

                    <div className="panel-heading">
                        <h3>📁 Target Job Description</h3>
                        <span className="required">Required</span>
                    </div>

                    <textarea
                        onChange={(e) => setJobDescription(e.target.value)}
                        value={jobDescription}
                        name="jobDescription"
                        id="jobDescription"
                        placeholder={`Paste the complete job description here...

Example:
• Responsibilities
• Required Skills
• Preferred Qualifications
• Company Overview`}
                    />

                    <div className="character-count">
                        {jobDescription.length} / 5000 Characters
                    </div>

                </div>

                {/* Right Panel */}

                <div className="right panel">

                    <div className="panel-heading">
                        <h3>👤 Your Profile</h3>
                    </div>

                    {/* Resume */}

                    <div className="input-group">

                        <label htmlFor="resume">
                            Upload Resume
                            <small className="high">
                                {" "}
                                (Best Result)
                            </small>
                        </label>

                        <label
                            className="upload-box"
                            htmlFor="resume"
                        >
                            <div className="upload-icon">
                                ☁
                            </div>

                            <h4>
                                    {resumeFileName || "Click to upload"}
                            </h4>

                            <p>
                                    {resumeFileName ? "Resume loaded" : "PDF only"}
                            </p>
                        </label>

                        <input ref={resumeInputRef}
                            type="file"
                            name="resume"
                            id="resume"
                            accept=".pdf"
                            hidden
                                onChange={(e) => setResumeFileName(e.target.files[0]?.name || "")}
                            />

                    </div>

                    <div className="divider">
                        <span>OR</span>
                    </div>

                    {/* Self Description */}

                    <div className="input-group">

                        <label htmlFor="selfDescription">
                            Quick Self Description
                        </label>

                        <textarea
                            onChange={(e) => setSelfDescription(e.target.value)}
                            value={selfDescription}
                            name="selfDescription"
                            id="selfDescription"
                            placeholder={`Briefly describe yourself...
                                • Skills
                                • Projects
                                • Experience
                                • Achievements
                                • Career Goals`
                            }
                        />

                    </div>

                    {/* Info */}

                    <div className="info-box">
                        💡 Either a Resume or a Self Description can help
                        generate a personalized interview report. Providing
                        both gives the best results.
                    </div>

                    {/* Button */}

                    <button 
                    className="generate-btn"
                    onClick={handleGenerateReport}
                    >
                        ✨ Generate Interview Report
                    </button>

                </div>

            </div>

            {(submitError || error) && (
                <p className="footer-note high">{submitError || error}</p>
            )}

            <section className="records-section">
                <h2>Your Recent Reports</h2>
                {reports.length === 0 ? (
                    <p className="footer-note">No records yet. Generate your first report above.</p>
                ) : (
                    <div className="records-grid">
                        {reports.map((item) => (
                            <article className="record-card" key={item._id}>
                                <h3>{item.title || "Interview Report"}</h3>
                                <p>Match Score: {item.matchScore ?? 0}%</p>
                                <p>Created: {new Date(item.createdAt).toLocaleString()}</p>
                                <div className="record-actions">
                                    <button className="generate-btn" onClick={() => navigate(`/interview/report/${item._id}`)}>
                                        View
                                    </button>
                                    <button className="generate-btn" onClick={() => downloadPdf(item._id)}>
                                        PDF
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <div className="footer-note">
                AI Powered • Usually takes 20-30 seconds
            </div>

        </main>
    );
};

export default GenerateReport;