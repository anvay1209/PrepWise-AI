import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../hooks/useinterview";
import { useAuth } from "../../auth/hooks/useAuth.js";
import "../style/dashboard.scss";

const Dashboard = () => {
  const { user } = useAuth();
  const { reports, loading, error, getAllReports, downloadPdf } = useInterview();
  const navigate = useNavigate();

  useEffect(() => {
    getAllReports().catch(() => {});
  }, [getAllReports]);

  const bestScore = reports.reduce((max, item) => Math.max(max, Number(item.matchScore || 0)), 0);
  const latestReport = reports[0];
  const completedReports = reports.length;

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1>Hi {user?.username || "there"}, ready to own your next interview?</h1>
          <p className="hero-copy">
            PrepWise AI centralizes your recent reports, suggests what to improve, and keeps your preparation moving forward.
          </p>
        </div>
        <div className="hero-actions">
          <button className="primary-btn" onClick={() => navigate("/generate-report")}>Generate Report</button>
          <button className="secondary-btn" onClick={() => navigate("/generate-resume")}>Generate Resume</button>
        </div>
      </section>

      <section className="dashboard-grid">
        <aside className="reports-panel">
          <div className="panel-header">
            <div>
              <h2>Your Recent Reports</h2>
              <p>Quick access to the latest AI interview summaries.</p>
            </div>
            <button className="link-button" onClick={() => navigate("/dashboard")}>View All Reports →</button>
          </div>

          <div className="reports-list">
            {loading ? (
              <div className="empty-state">Loading recent reports...</div>
            ) : reports.length === 0 ? (
              <div className="empty-state">No interview reports yet. Generate one to see personalized guidance.</div>
            ) : (
              reports.slice(0, 4).map((report) => (
                <article key={report._id} className="report-card">
                  <div className="report-meta">
                    <span className="report-title">{report.title || "Interview Report"}</span>
                    <span className="report-score">{report.matchScore ?? 0}%</span>
                  </div>
                  <p className="report-date">{new Date(report.createdAt).toLocaleString()}</p>
                  <div className="report-actions">
                    <button onClick={() => navigate(`/interview/report/${report._id}`)}>View</button>
                    <button className="download" onClick={() => downloadPdf(report._id)}>PDF</button>
                  </div>
                </article>
              ))
            )}
          </div>
        </aside>

        <section className="insights-panel">
          <div className="info-grid">
            <article className="card welcome-card">
              <h2>Welcome Back</h2>
              <p>Focus on the highest impact improvements and use AI-guided planning to stay ahead.</p>
            </article>
            <article className="card score-card">
              <h3>Interview Readiness</h3>
              <strong>{bestScore}%</strong>
              <p>Your strongest reported match from recent submissions.</p>
            </article>
            <article className="card actions-card">
              <h3>Quick Actions</h3>
              <button className="secondary-btn" onClick={() => navigate("/generate-report")}>New Report</button>
              <button className="secondary-btn" onClick={() => navigate("/generate-resume")}>Build Resume</button>
              {latestReport && <button className="secondary-btn" onClick={() => navigate(`/interview/report/${latestReport._id}`)}>Open Latest Report</button>}
            </article>
            <article className="card progress-card">
              <h3>Preparation Progress</h3>
              <p>{completedReports} report{completedReports === 1 ? "" : "s"} generated</p>
              <div className="progress-bar">
                <div style={{ width: `${Math.min(100, completedReports * 20)}%` }} />
              </div>
            </article>
            <article className="card skills-card">
              <h3>Skills to Improve</h3>
              {latestReport?.skillGaps?.length ? (
                <ul>
                  {latestReport.skillGaps.slice(0, 4).map((gap, index) => (
                    <li key={index}>
                      <span>{gap.skill}</span>
                      <strong>{gap.severity}</strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No skills detected yet. Generate a report for personalized suggestions.</p>
              )}
            </article>
            <article className="card insight-card">
              <h3>Recent Activity</h3>
              <p>{latestReport ? `Last report: ${latestReport.title || "Interview Report"} • ${new Date(latestReport.createdAt).toLocaleDateString()}` : "Submit a new job description and resume to generate your first report."}</p>
            </article>
          </div>
        </section>
      </section>

      {error && <p className="page-error">{error}</p>}
    </main>
  );
};

export default Dashboard;
