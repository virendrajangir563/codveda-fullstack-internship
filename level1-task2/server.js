const express = require("express");
const connectDB = require("./config/db.js");
const productRoutes = require("./routes/productRoutes.js");

const app = express();

const PORT = 5000;

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Codveda REST API is running"
    });
});

app.use("/api/products", productRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});