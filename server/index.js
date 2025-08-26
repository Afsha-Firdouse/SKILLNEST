import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./database/db.js"; // Assuming you have this file
import userRoute from "./routes/user.js";
import courseRoute from "./routes/course.js";
import adminRoute from "./routes/admin.js";
import Razorpay from "razorpay";
import path from "path";
import { fileURLToPath } from "url";

// Determine __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();


connectDb();

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// This is the crucial part for serving uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api", userRoute);
app.use("/api", courseRoute);
app.use("/api", adminRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});