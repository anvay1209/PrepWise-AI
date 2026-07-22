require("dotenv").config();

const connectToDB = require("./src/config/database");
connectToDB();



const app = require("./src/app");
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✓ Server is running on port ${PORT}`);
    console.log(
        `✓ Environment: ${process.env.NODE_ENV || "development"}`
    );
});