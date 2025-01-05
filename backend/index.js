import express from "express";
import dotenv from "dotenv";
import connectDb from "./db/connectMongoDb.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
connectDb();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Basic Health Check for Render
app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend is up and running!" });
});

// Redirect HTTP to HTTPS in Production
app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// Start Server
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  const HOST = "0.0.0.0"; // Bind to all network interfaces for Render deployment
  const server = app.listen(PORT, HOST, () =>
    console.log(`Server running on port ${PORT}`)
  );

  // Avoid Connection Reset by adjusting timeouts
  server.keepAliveTimeout = 120000; // 2 minutes
  server.headersTimeout = 120000; // 2 minutes
}

export { app };
