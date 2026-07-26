const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors")

const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ["http://localhost:5173"];
if (process.env.CLIENT_URL) {
    allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

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