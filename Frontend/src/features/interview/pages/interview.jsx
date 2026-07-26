import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useInterview } from "../hooks/useinterview";
import { downloadUpdatedResumeFromReport } from "../../resume/services/resume.api.js";
import "../style/interview.scss";

const Interview = () => {
    const { interviewId } = useParams();
    const navigate = useNavigate();
    const { report, loading, error, getReportById, downloadPdf } = useInterview();
    const [openTechnical, setOpenTechnical] = useState(null);
    const [openBehavioral, setOpenBehavioral] = useState(null);
    const [updateResumeLoading, setUpdateResumeLoading] = useState(false);

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId).catch(() => {});
        }
    }, [interviewId, getReportById]);

    if (loading) {
        return (
            <main className='loading-screen'>
                <h1>Loading Interview Report...</h1>
            </main>
        );
    }

    if (error) {
        return (
            <main className='loading-screen'>
                <h1>{error}</h1>
                <button className="retry-btn" onClick={() => navigate("/dashboard")}>
                    Back to Dashboard
                </button>
            </main>
        );
    }

    if (!report) {
        return (
            <main className='loading-screen'>
                <h1>Interview report not found.</h1>
                <button className="retry-btn" onClick={() => navigate("/dashboard")}>
                    Back to Dashboard
                </button>
            </main>
        );
    }

    const technicalQuestions = report.technicalQuestions || [];
    const behavioralQuestions = report.behavioralQuestions || [];
    const skillGaps = report.skillGaps || [];
    const preparationPlan = report.preparationPlan || [];

    const getSeverityClass = (severity) => {
        switch (String(severity).toLowerCase()) {
            case "high":
                return "high";
            case "medium":
                return "medium";
            default:
                return "low";
        }
    };

    const fallbackRecommendation =
        report.matchScore >= 85
            ? "Your profile is highly aligned with this role. Continue refining advanced concepts and mock interviews to maximize your chances."
            : report.matchScore >= 70
            ? "Your profile is a good match. Strengthen the highlighted skill gaps before your interview."
            : "Focus on the preparation roadmap and practice the suggested interview questions to improve your readiness.";

    return (
        <main className="interview-page">
            <section className="report-header">
                <h1>{report.title || "AI Interview Report"}</h1>
                <p>Personalized interview preparation generated from your resume, profile and job description.</p>
            </section>

            <section className="overview">
                <div className="score-card">
                    <h2>Overall Match</h2>
                    <div className="score-circle">
                        <span>{report.matchScore ?? 0}%</span>
                    </div>
                    <h3>{(report.matchScore ?? 0) >= 75 ? "Strong Match" : "Needs Improvement"}</h3>
                    <p>Your profile alignment is based on your resume and target role requirements.</p>
                </div>

                <div className="skills-card">
                    <h2>Skill Gap Analysis</h2>
                    <div className="skills-list">
                        {skillGaps.length === 0 ? (
                            <p>No major skill gaps detected.</p>
                        ) : (
                            skillGaps.map((item, index) => (
                                <div className="skill-item" key={index}>
                                    <span className="skill-name">{item.skill}</span>
                                    <span className={`severity ${getSeverityClass(item.severity)}`}>{item.severity}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            <section className="questions-section">
                <div className="section-title">
                    <h2>Technical Interview Questions</h2>
                    <p>Questions your interviewer is likely to ask based on your profile.</p>
                </div>

                <div className="accordion-list">
                    {technicalQuestions.map((question, index) => (
                        <div className={`accordion ${openTechnical === index ? "active" : ""}`} key={index}>
                            <button
                                className="accordion-header"
                                onClick={() => setOpenTechnical(openTechnical === index ? null : index)}
                            >
                                <span>{index + 1}. {question.question}</span>
                                <span className="icon">{openTechnical === index ? "−" : "+"}</span>
                            </button>

                            {openTechnical === index && (
                                <div className="accordion-body">
                                    <div className="answer-block">
                                        <h4>Interviewer's Intention</h4>
                                        <p>{question.intention}</p>
                                    </div>
                                    <div className="answer-block">
                                        <h4>Ideal Answer</h4>
                                        <p>{question.answer}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <section className="questions-section">
                <div className="section-title">
                    <h2>Behavioral Interview Questions</h2>
                    <p>Showcase communication, teamwork and problem-solving with these questions.</p>
                </div>

                <div className="accordion-list">
                    {behavioralQuestions.map((question, index) => (
                        <div className={`accordion ${openBehavioral === index ? "active" : ""}`} key={index}>
                            <button
                                className="accordion-header"
                                onClick={() => setOpenBehavioral(openBehavioral === index ? null : index)}
                            >
                                <span>{index + 1}. {question.question}</span>
                                <span className="icon">{openBehavioral === index ? "−" : "+"}</span>
                            </button>

                            {openBehavioral === index && (
                                <div className="accordion-body">
                                    <div className="answer-block">
                                        <h4>Interviewer's Intention</h4>
                                        <p>{question.intention}</p>
                                    </div>
                                    <div className="answer-block">
                                        <h4>Ideal Answer</h4>
                                        <p>{question.answer}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <section className="timeline-section">
                <div className="section-title">
                    <h2>Preparation Roadmap</h2>
                    <p>Follow this personalized study schedule to maximize interview readiness.</p>
                </div>

                <div className="timeline">
                    {preparationPlan.map((plan, index) => (
                        <div className="timeline-item" key={index}>
                            <div className="timeline-left">
                                <div className="timeline-dot" />
                                {index !== preparationPlan.length - 1 && <div className="timeline-line" />}
                            </div>

                            <div className="timeline-card">
                                <span className="day-badge">Day {plan.day}</span>
                                <h3>{plan.focus}</h3>
                                <p>{plan.task}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="summary-card">
                <h2>Final Recommendation</h2>
                <p>{report.finalRecommendation || fallbackRecommendation}</p>
            </section>

            <section className="action-buttons">
                <button className="download-btn" onClick={() => downloadPdf(interviewId)}>
                    📄 Download Report PDF
                </button>
                <button
                    className="download-btn"
                    onClick={async () => {
                        setUpdateResumeLoading(true);
                        try {
                            const blob = await downloadUpdatedResumeFromReport(interviewId);
                            const url = window.URL.createObjectURL(blob);
                            const anchor = document.createElement("a");
                            anchor.href = url;
                            anchor.download = `updated_resume_${interviewId}.pdf`;
                            document.body.appendChild(anchor);
                            anchor.click();
                            document.body.removeChild(anchor);
                            window.URL.revokeObjectURL(url);
                        } catch (err) {
                            console.error("Resume update failed:", err);
                        } finally {
                            setUpdateResumeLoading(false);
                        }
                    }}
                    disabled={updateResumeLoading}
                >
                    {updateResumeLoading ? "Updating resume..." : "📝 Update Resume"}
                </button>
                <button className="retry-btn" onClick={() => navigate("/dashboard") }>
                    🔄 Back to Dashboard
                </button>
            </section>

            <footer className="report-footer">
                <div className="footer-content">
                    <h3>AI Interview Report</h3>
                    <p>Generated using your resume, self description and job description.</p>
                    <span>Good luck with your interview 🚀</span>
                </div>
            </footer>
        </main>
    );
};

export default Interview;
