const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const protectedRoute = require("./routes/protectedRoute");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/db");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");

dotenv.config();

//database
connectDB();
app.use(cookieParser());

//middlewares
app.use(express.json());
// app.use("/images", express.static(path.join(__dirname, "/images")));
const corsOptions = {
  origin: ["http://localhost:5173", "https://bloggify-ui-7phws7qza-kunal-goswamis-projects.vercel.app"], // Specify your frontend's URLs
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  allowedHeaders: ["Content-Type", "Authorization"], // Add other headers as needed
};

app.use(cors(corsOptions));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
// app.use(express.static("images"));
app.use("/images", express.static(path.join(__dirname, "images")));

//image upload
const storage = multer.diskStorage({
  destination: (req, file, fn) => {
    fn(null, "images");
  },
  filename: (req, file, fn) => {
    const filename = Date.now() + "-" + file.originalname;
    fn(null, filename);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json("No file uploaded");
    }
    res.status(200).json({ filename: req.file.filename });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use("/api", protectedRoute); // Mount the protected route

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});
app.get("/", async (req, res) => {
  try {
    res.status(200).json({ msg: "I am in home route" });
  } catch (error) {
    res.status(500).json({ msg: "Error in home route" });
  }
});

app.listen(process.env.PORT, () => {
  console.log("app is running on port " + process.env.PORT);
});
