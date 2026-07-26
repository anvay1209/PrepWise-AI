import "./about.scss";

const About = () => {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <p className="eyebrow">About PrepWise AI</p>
          <h1>Transform the way you prepare for interviews and build resumes.</h1>
          <p>
            PrepWise AI blends smart resume guidance, job matching analysis, and personalized interview prep into one polished experience.
          </p>
        </div>
      </section>

      <section className="about-features">
        <article className="feature-card">
          <h2>AI Resume Builder</h2>
          <p>Create a polished resume tailored to your target job, then download it as a clean PDF.</p>
        </article>
        <article className="feature-card">
          <h2>Job Analyzer</h2>
          <p>Check your alignment with the role and get a match score plus skill gap recommendations.</p>
        </article>
        <article className="feature-card">
          <h2>Interview Preparation</h2>
          <p>Practice with technical and behavioral questions while following a personalized five-day prep plan.</p>
        </article>
      </section>

      <section className="about-story">
        <div className="story-content">
          <h2>Why PrepWise AI?</h2>
          <p>
            Every interview is different, but the right preparation makes your performance consistent. PrepWise AI helps you stay calm, confident, and ready with tailored reports, download-ready documents, and smart interview strategies.
          </p>
          <p>
            Whether you are building your first professional resume or preparing for an advanced technical role, our AI companion gives you structured feedback and a clear next step.
          </p>
        </div>
      </section>
    </main>
  );
};

export default About;
