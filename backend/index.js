const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");

// 1. Load config
dotenv.config({ path: "./.env" });

// 2. Middleware cơ bản
app.use(express.json({ limit: "50mb" }));

// 3. Cấu hình CORS - cho phép linh hoạt để tránh lỗi triệt để
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());

// 4. Kết nối DB (Sequelize)
const { connectToDB } = require("./db");
require("./models/associations");

connectToDB().catch((err) => console.error("Database connection failed:", err));

// 5. Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/teachers", require("./routes/teacherRoutes"));
app.use("/api/v1/student", require("./routes/studentRoutes"));

// Error handler
app.use(require("./controllers/errorController"));

// 6. Phân tách môi trường
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5003;
  app.listen(PORT, () => console.log(`Server local running on port ${PORT}`));
}

module.exports = app;
