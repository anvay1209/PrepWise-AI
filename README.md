# PrepWise AI

PrepWise AI is an intelligent resume builder and interview preparation platform. It combines resume generation, job description analysis, and interview report generation into a single experience powered by Gemini AI.

## Key features

- AI Resume Builder
  - Upload your current resume and target job description.
  - Generate a tailored resume optimized for the role.
  - Download the generated resume as a PDF.

- Job Analyzer
  - Upload a resume and provide a job description.
  - Generate an interview readiness report with a match score.
  - Receive customized technical and behavioral questions.

- Interview Preparation
  - View a five-day preparation roadmap.
  - See skill gaps and recommendations.
  - Download interview reports and AI-generated resumes.

## Project structure

- `Frontend/` - React + Vite application with routing, auth, dashboard, resume builder, job analyzer, and report pages.
- `Backend/` - Express API with authentication, interview report generation, resume generation, and PDF creation.

## Setup

### Backend

1. Navigate to `Backend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following values:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_GENAI_API_KEY=your_google_genai_api_key
   ```
4. Start the backend:
   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to `Frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```

## Routes

- `/login` - login page
- `/register` - register page
- `/dashboard` - main dashboard
- `/generate-report` - job analyzer / interview report generation
- `/generate-resume` - AI resume builder
- `/interview/report/:interviewId` - interview report details
- `/about` - about page

## Notes

- The backend uses Gemini AI to generate interview reports and resumes.
- PDF generation is handled by separate backend services for reports and resumes.
- The app uses cookie-based auth with JWT and requires the user to be logged in to access dashboard features.
