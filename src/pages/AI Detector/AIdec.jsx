import React, { useState } from "react";
import './AIdec.css';  
import Navbar from "../../components/Navbar";


const AIdec = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 

  const checkThreatLevel = async () => {
    setResult(null);
    setError("");

    if (!url) {
      setError("Please enter a URL.");
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setResult(null);
      } else {
        setResult(data);
        setError("");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container2">
        <h2>URL Security Scanner</h2>
        <div className="input-group">
          <input 
            type="text" 
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button onClick={checkThreatLevel}>Check</button>
        </div>

        {loading && <p>Loading...</p>}  {/* Show loading message here */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {result && (
          <div className="URLresult">
            <h3>Scan Results</h3>
            <p><strong>URL:</strong> {result.url}</p>
            <p><strong>Malicious Reports:</strong> {result.malicious_reports}</p>
            <p><strong>Suspicious Reports:</strong> {result.suspicious_reports}</p>
            <p><strong>Undetected Reports:</strong> {result.undetected_reports}</p>
            <div className="statusURL">
              <h3>Status: {result.safety_status}</h3>
            </div>
          </div>
        )}
      </div>
      <div className="footer">
        &copy; 2025 RiskAnalyze. All Rights Reserved.
      </div>
    </div>
  );
};

export default AIdec;
