const multr = require("multer");

const upload = multr({
    storage: multr.memoryStorage(),
    limits: { fileSize: 3 * 1024 * 1024 }, // Limit file size to 3MB
});

function singleResumeUpload(req, res, next) {
    upload.single("resume")(req, res, (error) => {
        
        if (error) {
            if (error instanceof multr.MulterError) {
                if (error.code === "LIMIT_FILE_SIZE") {
                    return res.status(400).json({ message: "Resume file size must be less than 3MB" });
                }
                return res.status(400).json({ message: error.message });
            }

            if (error.message && error.message.includes("Malformed part header")) {
                return res.status(400).json({
                    message: "Invalid multipart form-data request. Remove manual Content-Type header and resend."
                });
            }

            return next(error);
        }

        next();
    });
}

module.exports = { upload, singleResumeUpload };