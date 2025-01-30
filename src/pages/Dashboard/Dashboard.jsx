import { useState, useEffect, useRef } from "react";
import { db } from "../../firebase"; 
import { collection, getDocs, updateDoc, doc } from "firebase/firestore"; // Import updateDoc and doc for updating Firebase data
import Chart from "chart.js/auto";
import "./Dashboard.css";
import user from "../../assets/user.svg";
import add from "../../assets/add.svg";

const Dashboard = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [data, setData] = useState([]);
  const [userEmail, setUserEmail] = useState(""); 
  const [riskCount, setRiskCount] = useState(0); // Store risk count

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "assessments"));
      const assessments = [];

      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        assessments.push({
          id: doc.id,
          title: docData.phase3?.areaOfConcern || "Unknown", 
          date: docData.phase4?.timestamp
            ? new Date(docData.phase4.timestamp.seconds * 1000).toLocaleDateString()
            : "N/A",
          system: docData.phase3?.system || "Unknown",
          riskLevel: docData.phase4?.impactLevel || "Unknown",
          status: docData.phase4?.status || "In Progress",
        });
      });

      setData(assessments);
    };

    fetchData();
  }, []);

  // Handle Risk Level Change
  const handleRiskLevelChange = async (id, newRiskLevel) => {
    const updatedData = data.map(item =>
      item.id === id ? { ...item, riskLevel: newRiskLevel } : item
    );
    setData(updatedData);

    // Update Firebase
    const assessmentDoc = doc(db, "assessments", id);
    await updateDoc(assessmentDoc, {
      "phase4.impactLevel": newRiskLevel,
    });
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedData = data.map(item =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    setData(updatedData);
  };

  const getRiskLevelClass = (level) => {
    switch(level) {
      case "LOW": return "low-risk";
      case "MEDIUM": return "medium-risk";
      case "HIGH": return "high-risk";
      default: return "";
    }
  };

  const getStatusClass = (status) => {
    return status === "In Progress" ? "in-progress" : "completed";
  };

  // Function to update chart data based on risk levels
  const updateChart = () => {
    const low = data.filter(item => item.riskLevel.trim().toUpperCase() === "LOW").length;
    const medium = data.filter(item => item.riskLevel.trim().toUpperCase() === "MEDIUM").length;
    const high = data.filter(item => item.riskLevel.trim().toUpperCase() === "HIGH").length;

    console.log("Chart Data:", { low, medium, high }); // Log to check the values

    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Low", "Medium", "High"],
          datasets: [
            {
              data: [low, medium, high],
              backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
            },
          ],
        },
      });
    } else {
      console.error("Chart reference is null or canvas not found!");
    }
  };

  // Calculate the risk count
  const getRiskCounts = () => {
    const low = data.filter(item => item.riskLevel.trim().toUpperCase() === "LOW").length;
    const medium = data.filter(item => item.riskLevel.trim().toUpperCase() === "MEDIUM").length;
    const high = data.filter(item => item.riskLevel.trim().toUpperCase() === "HIGH").length;

    return { low, medium, high };
  };

  useEffect(() => {
    if (data.length > 0) {
      updateChart(); // Update chart whenever the data changes
      const { low, medium, high } = getRiskCounts();
      setRiskCount(low + medium + high); // Set the total risk count
    }
  }, [data]);

  return (
    <div className="container">
      <div className="header">
        <div className="profile-card">
          <div className="profile-header">
            <img src={user} alt="Profile" className="profile-picture" />
            <span>{userEmail || "User101"}</span> 
          </div>
        </div>
        <a href="/assesment" className="add-record-card">
          <div className="profile-card add-record-content">
            <img src={add} alt="Add" className="profile-picture" />
            <span>Add New Record</span>
          </div>
        </a>
      </div>

      <div className="content">
        <div className="card">
          <h3>Overview Security Level</h3>
          <canvas ref={chartRef} width="400" height="400"></canvas>
        </div>

        <div className="card impact-priority">
          <h3>Impact Areas Priority</h3>
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>1</th>
                <th>2</th>
                <th>3</th>
                <th>4</th>
                <th>5</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Reputation & Confidence</td>
                <td colSpan="3"></td>
                <td>&#10004;</td>
                <td></td>
              </tr>
              <tr>
                <td>Financial</td>
                <td colSpan="3"></td>
                <td>&#10004;</td>
                <td></td>
              </tr>
              <tr>
                <td>Productivity</td>
                <td colSpan="4"></td>
                <td>&#10004;</td>
              </tr>
              <tr>
                <td>Safety & Health</td>
                <td colSpan="2"></td>
                <td>&#10004;</td>
                <td colSpan="2"></td>
              </tr>
              <tr>
                <td>Fines & Legal</td>
                <td colSpan="4"></td>
                <td>&#10004;</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div id="right-section">
          <div className="top-box">
            <span className="risk-number">{riskCount}</span>
            <p>Risk Analyzed</p>
          </div>
          <div className="bottom-box">
            <span className="low">Low</span>
            <p>Average Risk</p>
          </div>
        </div>

        <div className="form-result">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>System</th>
                <th>Risk Level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row,index) => (
                <tr key={index}>
                  <td>{row.title}</td>
                  <td>{row.date}</td>
                  <td>{row.system}</td>
                  <td>
                    <select
                      value={row.riskLevel}
                      onChange={(e) => handleRiskLevelChange(row.id, e.target.value)}
                      className={getRiskLevelClass(row.riskLevel)}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={row.status}
                      onChange={(e) => handleStatusChange(row.id, e.target.value)}
                      className={getStatusClass(row.status)}
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="footer">
          &copy; 2025 RiskAnalyze. All Rights Reserved.
      </div>
    </div>
  );
};

export default Dashboard;
