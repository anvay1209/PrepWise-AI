const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const allowedOrigins = ["http://localhost:5173"];
if (process.env.CLIENT_URL) {
    // support a comma-separated list of allowed client origins in the env var
    allowedOrigins.push(...process.env.CLIENT_URL.split(",").map(s => s.trim()).filter(Boolean));
}

app.use(
    cors({
        origin: (origin, callback) => {
            // allow non-browser requests (no origin) such as server-to-server or curl
            if (!origin) {
                return callback(null, true);
            }

            // allow exact matches from the whitelist
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            // allow common static-hosting provider subdomains if needed (netlify, render, vercel)
            // this helps when CLIENT_URL isn't populated on the backend host but the frontend is hosted on one of these services
            try {
                const lower = origin.toLowerCase();
                if (lower.endsWith('.netlify.app') || lower.endsWith('.onrender.com') || lower.endsWith('.vercel.app')) {
                    return callback(null, true);
                }
            } catch (e) {
                // ignore and fall through to rejection
            }

            console.warn('CORS blocked origin:', origin);
            callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "PrepWise AI Backend Running 🚀",
    });
});
console.log("CLIENT_URL:", process.env.CLIENT_URL);
console.log("NODE_ENV:", process.env.NODE_ENV);

/* requires all auth routes here */
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");
const resumeRouter = require("./routes/resume.routes");




/* using the auth routes here*/
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/resume", resumeRouter);




// Global error handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({ 
        message: err.message || "Internal Server Error" 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

module.exports = app;