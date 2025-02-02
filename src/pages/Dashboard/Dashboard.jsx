import { useState, useEffect, useRef } from "react";
import { db, auth } from "../../firebase";
import { collection, getDocs, updateDoc, doc, query, where } from "firebase/firestore";
import Chart from "chart.js/auto";
import "./Dashboard.css";
import user from "../../assets/user.svg";
import add from "../../assets/add.svg";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged,} from "firebase/auth";

const Dashboard = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [data, setData] = useState([]);
  const [userName, setUserName] = useState(""); 
  const [riskCount, setRiskCount] = useState(0);
  const [averageRisk, setAverageRisk] = useState("Low");
  const [chartKey, setChartKey] = useState(0);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      } else {
        const fetchUserName = async () => {
          const userRef = collection(db, "user");
          const q = query(userRef, where("uid", "==", user.uid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setUserName(userData.name);
          }
          setData([]);
          fetchData();
        };
        
        fetchUserName();
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchData = async () => {
    const user = auth.currentUser;  
    if (!user) return; 
  
    const userUid = user.uid; 
  
    const querySnapshot = await getDocs(collection(db, "assessments"));
    const assessments = [];
  
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      if (docData.user?.uid === userUid) {
        const timestamp = docData.timestamp;
        let formattedDate = "Unknown";
        if (timestamp && timestamp.toDate) {
          formattedDate = timestamp.toDate().toLocaleDateString("en-GB");
        }
  
        assessments.push({
          id: doc.id,
          title: docData.phase3?.areaOfConcern || "Unknown",
          date: formattedDate,
          riskLevel: docData.phase4?.impactLevel?.toUpperCase() || "UNKNOWN",
          status: docData.phase4?.status || "In Progress",
          asset: docData.phase3?.affectedAsset || "Unknown"
        });
      }
    });
  
    setData(assessments);
    updateChart();
    calculateAverageRisk();
  };
  

  const handleRiskLevelChange = async (id, newRiskLevel) => {
    const upperCaseRisk = newRiskLevel.toUpperCase();
    console.log(`Updating risk level for ${id} to ${upperCaseRisk}`);
  
    const updatedData = data.map(item =>
      item.id === id ? { ...item, riskLevel: upperCaseRisk } : item
    );
    setData(updatedData);

    const assessmentDoc = doc(db, "assessments", id);
    await updateDoc(assessmentDoc, {
      "phase4.impactLevel": upperCaseRisk,
    });
  };

  const handleStatusChange = async (id, newStatus) => {
  console.log(`Updating status for ${id} to ${newStatus}`);

  const updatedData = data.map(item =>
    item.id === id ? { ...item, status: newStatus } : item
  );
  setData(updatedData);

  const assessmentDoc = doc(db, "assessments", id);
  await updateDoc(assessmentDoc, {
    "phase4.status": newStatus,
  });
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

  const updateChart = () => {
    const low = data.filter(item => item.riskLevel.trim().toUpperCase() === "LOW").length;
    const medium = data.filter(item => item.riskLevel.trim().toUpperCase() === "MEDIUM").length;
    const high = data.filter(item => item.riskLevel.trim().toUpperCase() === "HIGH").length;
  
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
    }
  };
  
  const getRiskCounts = () => {
    const inProgressData = data.filter(item => item.status === "In Progress");
    const low = inProgressData.filter(item => item.riskLevel.trim().toUpperCase() === "LOW").length;
    const medium = inProgressData.filter(item => item.riskLevel.trim().toUpperCase() === "MEDIUM").length;
    const high = inProgressData.filter(item => item.riskLevel.trim().toUpperCase() === "HIGH").length;
  
    return { low, medium, high };
  };
  
  const calculateAverageRisk = () => {
    const { low, medium, high } = getRiskCounts();
    const total = low + medium + high;
    
    if (total === 0) {
      setAverageRisk("Low");
      return;
    }
  
    const percentageLow = (low / total) * 100;
    const percentageMedium = (medium / total) * 100;
    const percentageHigh = (high / total) * 100;
  
    if (percentageLow > percentageMedium && percentageLow > percentageHigh) {
      setAverageRisk("Low");
    } else if (percentageMedium > percentageLow && percentageMedium > percentageHigh) {
      setAverageRisk("Medium");
    } else {
      setAverageRisk("High");
    }
  };
  useEffect(() => {
    if (data.length > 0) {
      updateChart();  
      const { low, medium, high } = getRiskCounts();
      setRiskCount(low + medium + high); 
      calculateAverageRisk();  
      updateChart();
      calculateAverageRisk();
    }
  }, [data]);  

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      navigate("/login");  
    } catch (error) {
      console.log("Logout failed:", error.message);
      alert("Logout failed: " + error.message);
    }
  };  

  return (
    <div className="container">
      <div className="header">
      <div className="profile-card" 
             onMouseEnter={() => setIsProfileHovered(true)} 
             onMouseLeave={() => setIsProfileHovered(false)}>
          <div className="profile-header">
            <img src={user} alt="Profile" className="profile-picture" />
            <span>{userName || "User101"}</span>
            {isProfileHovered && (
              <div className="logout-option" onClick={handleLogout}>
                Logout
              </div>
            )}
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
          <h3>Impact Areas Priority</h3>  {data.length > 0 ? (
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
                <td colSpan="1"></td>
                <td>&#10004;</td>
                <td colSpan="1"></td>
                <td colSpan="1"></td>
                <td></td>
              </tr>
              <tr>
                <td>Financial</td>
                <td colSpan="1"></td>
                <td colSpan="1"></td>
                <td colSpan="1"></td>
                <td>&#10004;</td>
                <td></td>
              </tr>
              <tr>
                <td>Productivity</td>
                <td colSpan="1"></td>
                <td colSpan="1"></td>
                <td colSpan="1"></td>
                <td colSpan="1"></td>
                <td>&#10004;</td>
              </tr>
              <tr>
                <td>Safety & Health</td>
                <td colSpan="1"></td>
                <td colSpan="1"></td>
                <td>&#10004;</td>
                <td colSpan="1"></td>
                <td colSpan="1"></td>
              </tr>
              <tr>
                <td>Fines & Legal</td>
                <td>&#10004;</td>
                <td colSpan="1"></td>
                <td colSpan="1"></td>
                <td colSpan="1"></td>
                <td colSpan="1"></td>
              </tr>
            </tbody>
          </table>):(<p>No data available yet. Please add a record.</p>)}
        </div>

        <div id="right-section">
          <div className="top-box">
            <span className="risk-number">{riskCount}</span>
            <p>Risk Analyzed</p>
          </div>
          <div className="bottom-box">
          <div className="average-risk">
            <span style={{color:averageRisk === 'Low'? 'limegreen': averageRisk === 'Medium'? '#ff9800': '#f44336',}}>{averageRisk}</span>
            <p>Average Risk</p>
          </div>
        </div>
        </div>

        <div className="form-result">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Asset</th>
                <th>Risk Level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td>{row.title}</td>
                  <td>{row.date}</td>
                  <td>{row.asset}</td>
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
