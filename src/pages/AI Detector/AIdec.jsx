import React, { useState } from "react";
import './AIdec.css';  // Pastikan file CSS diimpor

const AIdec = () => {
  const [url, setUrl] = useState("");
  const [threatLevel, setThreatLevel] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkThreatLevel = async () => {
    if (!url) return;

    setLoading(true);
    setThreatLevel(null);

    try {
      const response = await fetch("https://localhost/events/restSearch", {
        method: "POST",
        headers: {
          "Authorization": "ckSQEP47q4YagBuJxdfPGv0pbq63PaDAuXHjrtLr",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          returnFormat: "json",
          values: url, 
          enforceWarninglist: true 
        })
      });

      const data = await response.json();

      if (data.response.Attribute.length > 0) {
        const threatTypes = data.response.Attribute.map(attr => attr.category);
        if (threatTypes.includes("High")) {
          setThreatLevel("High");
        } else if (threatTypes.includes("Medium")) {
          setThreatLevel("Medium");
        } else {
          setThreatLevel("Low");
        }
      } else {
        setThreatLevel("Low"); 
      }
    } catch (error) {
      console.error("Error fetching threat level:", error);
      setThreatLevel("Error"); 
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h2>Threat Level Detector</h2>
      <div className="input-group">
        <input 
          type="text" 
          placeholder="Enter URL" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)} 
        />
        <button onClick={checkThreatLevel}>
          Check Threat Level
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {threatLevel && !loading && (
        <p>
          Threat Level : 
          {threatLevel === "Low" && <span className="low"> 🟢 Low</span>}
          {threatLevel === "Medium" && <span className="medium"> 🟡 Medium</span>}
          {threatLevel === "High" && <span className="high"> 🔴 High</span>}
          {threatLevel === "Error" && <span className="error"> 🔴 Error fetching data</span>}
        </p>
      )}
    </div>
  );
};

export default AIdec;