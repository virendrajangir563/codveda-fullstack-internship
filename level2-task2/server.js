require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

const PORT = 5001;

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Codveda Authentication API is running"
    });
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});