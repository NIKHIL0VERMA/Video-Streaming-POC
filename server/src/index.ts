import Express from "express";
import cors from "cors";
import multer from "multer";

const app = Express();
const port = 8000;

// Middleware
app.use(cors({
  credentials: true,
  origin: "http://localhost:3000"
}));
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

// File upload setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the video streaming server!");
});

app.head("/health", (req, res) => {
  res.status(200).send("OK");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
