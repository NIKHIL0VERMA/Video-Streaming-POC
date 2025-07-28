import Express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { exec } from "child_process"

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
        cb(null, "uploads/raw/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Serve static files
app.use("/uploads", Express.static(path.join(__dirname, "../uploads")));

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the video streaming server!");
});

app.head("/health", (req, res) => {
  res.status(200).send("OK");
});

app.post("/upload", upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const videoPath = req.file.path;
  const outputPath = `uploads/${req.file.filename.split('.')[0]}`;
  const main = `${outputPath}/main.m3u8`;
  if(!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  // in production ye to asyncronous hi krna hoga event loop block nhi krna pure server ka ;)
  // Koi fffmpeg acha comman btao bhai, production me to aac hoga or kya pta krna hoga
  exec(`ffmpeg -i ${videoPath} -codec:v libx264 -profile:v baseline -level 3.0 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/part%02d.ts" -start_number 0 ${main}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error processing video: ${error.message}`);
      return res.status(500).json({ error: "Error processing video" });
    }
    if (stderr) {
      console.error(`FFmpeg stderr: ${stderr}`);
    }
    console.log(`FFmpeg stdout: ${stdout}`);
    const url = `http://localhost:${port}/${outputPath}/main.m3u8`;
    res.status(200).json({ message: "Video processed successfully", url: url });
  }); 
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
