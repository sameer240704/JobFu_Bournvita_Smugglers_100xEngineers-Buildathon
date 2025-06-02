import express from "express";
import connectToDatabase from "./database/mongo.db.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

// Importing routes
import userRoutes from "./routes/user.routes.js";
import shortlistingRoutes from "./routes/shortlisting.route.js";
import chatRoutes from "./routes/chathistory.routes.js";
import candidateRoutes from "./routes/candidate.routes.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/shortlist", shortlistingRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/candidates", candidateRoutes);

app.get("/", (req, res) => {
  res.send("Connected to MongoDB!");
});

const PORT = process.env.PORT || 4224;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

connectToDatabase();