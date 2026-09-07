const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const taxonomyRoutes = require("./routes/taxonomyRoutes");
const matchingRoutes = require("./routes/matchingRoutes");
const profileRoutes = require("./routes/profileRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const adminRoutes = require("./routes/adminRoutes");
const institutionRoutes = require("./routes/institutionRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
app.set("trust proxy", 1);

const configuredOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const developmentOrigins =
  process.env.NODE_ENV === "production"
    ? []
    : [
        "http://localhost:3000",
        "http://localhost:3002",
        "http://localhost:3003",
      ];
const allowedOrigins = new Set([...configuredOrigins, ...developmentOrigins]);

app.disable("x-powered-by");
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
app.use("/api", apiLimiter);
app.use("/api/auth", authLimiter);

app.get("/", (req, res) => {
  res.json({ name: "AYUSH Skill Mapping API", status: "ok" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "ayush-platform-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/taxonomy", taxonomyRoutes);
app.use("/api/matching", matchingRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/institutions", institutionRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
