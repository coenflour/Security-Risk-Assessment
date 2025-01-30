import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "./Dashboard.css";
import user from "../../assets/user.svg";
import add from "../../assets/add.svg";
import Navbar from '../../components/Navbar';

const Dashboard = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const [data, setData] = useState([
    { id: 1, riskLevel: "HIGH", status: "In Progress" },
    { id: 2, riskLevel: "LOW", status: "Completed" },
    { id: 3, riskLevel: "MEDIUM", status: "Completed" },
    { id: 4, riskLevel: "HIGH", status: "In Progress" },
  ]);

  const [userEmail, setUserEmail] = useState(""); 

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const handleRiskLevelChange = (id, newRiskLevel) => {
    const updatedData = data.map(item =>
      item.id === id ? { ...item, riskLevel: newRiskLevel } : item
    );
    setData(updatedData);
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedData = data.map(item =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    setData(updatedData);
  };

  const getRiskLevelClass = (level) => {
    switch(level) {
      case "LOW":
        return "low-risk";
      case "MEDIUM":
        return "medium-risk";
      case "HIGH":
        return "high-risk";
      default:
        return "";
    }
  };

  const getStatusClass = (status) => {
    return status === "In Progress" ? "in-progress" : "completed";
  };

  useEffect(() => {
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
            data: [28, 42, 30],
            backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
          },
        ],
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

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
          <canvas ref={chartRef}></canvas>
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
                <td><span className="empty"></span></td>
                <td><span className="empty"></span></td>
                <td><span className="empty"></span></td>
                <td><span className="checked">&#10004;</span></td>
                <td><span className="empty"></span></td>
              </tr>
              <tr>
                <td>Financial</td>
                <td><span className="empty"></span></td>
                <td><span className="empty"></span></td>
                <td><span className="empty"></span></td>
                <td><span className="checked">&#10004;</span></td>
                <td><span className="empty"></span></td>
              </tr>
              <tr>
                <td>Productivity</td>
                <td><span className="empty"></span></td>
                <td><span className="empty"></span></td>
                <td><span className="empty"></span></td>
                <td><span className="empty"></span></td>
                <td><span className="checked">&#10004;</span></td>
              </tr>
              <tr>
                <td>Safety & Health</td>
                <td><span className="empty"></span></td>
                <td><span className="empty"></span></td>
                <td><span className="checked">&#10004;</span></td>
                <td><span className="empty"></span></td>
                <td><span className="empty"></span></td>
              </tr>
              <tr>
                <td>Fines & Legal</td>
                <td><span className="empty"></span></td>
                <td><span className="empty"></span></td>
                <td><span className="empty"></span></td>
                <td><span className="empty"></span></td>
                <td><span className="checked">&#10004;</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div id="right-section">
          <div className="top-box">
            <span className="risk-number">8</span>
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
                <th>ID</th>
                <th>Title</th>
                <th>Date</th>
                <th>System</th>
                <th>Risk Level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>API Gateway Server</td>
                  <td>Jan 19, 2025</td>
                  <td>E-Commerce Backend</td>
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
