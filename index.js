const express = require("express");
const app = express();
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/db");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");

dotenv.config();

//database
connectDB();

//middlewares
app.use(express.json());
// app.use("/images", express.static(path.join(__dirname, "/images")));
<<<<<<< HEAD
const corsOptions = {
  origin: "http://localhost:5173", // Specify your frontend's URL
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  allowedHeaders: ["Content-Type", "Authorization"], // Add other headers as needed
};

app.use(cors(corsOptions));
=======
>>>>>>> 2f55c2b8bb0eea38f22ef3c242794681aeba6eff

app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


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

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "build")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "build", "index.html"));
//   });
// }

app.get("/", async (req, res) => {
  try {
    res.status(200).json({ msg: "I am in home route" });
  } catch (error) {
    res.status(500).json({ msg: "Error in home route" });
  }
});

app.get("/api/auth/login", async (req, res) => {
  try {
    res.status(200).json({ msg: "I am in login route" });
  } catch (error) {
    res.status(500).json({ msg: "Error in login route" });
  }
});

app.listen(process.env.PORT, () => {
  console.log("app is running on port " + process.env.PORT);
});
