require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");

const app = express();
app.use(cors());
app.use(express.json());    

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const upload = multer({ dest: "/tmp/" });

function extractMarks(text) {
  const subjects = {};
  const lines = text.split("\n");

  lines.forEach(line => {
    const match = line.match(/(Math|Physics|English|Computer)\s+(\d+)/i);
    if (match) {
      subjects[match[1]] = parseInt(match[2]);
    }
  });

  return subjects;
}

function generatePlan(subjects) {
  let weak = [];
  let strong = [];

  for (let sub in subjects) {
    if (subjects[sub] < 70) weak.push(sub);
    else strong.push(sub);
  }

  return {
    weak,
    strong,
    plan: [
      `Focus more on ${weak.join(", ")}`,
      "Daily revision for 1 hour",
      "Weekly mock test"
    ]
  };
}

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const buffer = fs.readFileSync(req.file.path);
    const pdf = await pdfParse(buffer);

    const subjects = extractMarks(pdf.text);
    const plan = generatePlan(subjects);

    fs.unlinkSync(req.file.path);

    res.json({ name: "Student", subjects, ...plan });
  } catch (err) {
    res.status(500).json({ error: "Error processing PDF" });
  }
});

app.listen(5000, () => console.log("Server running"));