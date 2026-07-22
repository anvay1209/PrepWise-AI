const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors")

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors(
    {
        origin:"http://localhost:5173",
        credentials: true 
    }
))



/* requires all auth routes here */
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");




/* using the auth routes here*/
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);




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