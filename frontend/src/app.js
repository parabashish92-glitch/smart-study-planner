import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData
      );

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>📚 Smart Study Planner</h1>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={uploadFile}
        style={{
          marginLeft: "10px",
          padding: "8px 15px",
          cursor: "pointer"
        }}
      >
        Upload PDF
      </button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h2>Student Report</h2>

          <h3>Name: {result.name}</h3>

          <h3>Subjects</h3>
          <ul>
            {Object.entries(result.subjects).map(([subject, marks]) => (
              <li key={subject}>
                {subject}: {marks}
              </li>
            ))}
          </ul>

          <h3>Weak Subjects</h3>
          <p>{result.weak.join(", ")}</p>

          <h3>Strong Subjects</h3>
          <p>{result.strong.join(", ")}</p>

          <h3>Study Plan</h3>
          <ul>
            {result.plan.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;