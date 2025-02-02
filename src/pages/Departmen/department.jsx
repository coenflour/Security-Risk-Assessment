import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import './department.css';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; 
import emailjs from 'emailjs-com';
import email from '../../assets/email.svg';
import download from '../../assets/download.svg';

const Department = () => {
  const [assessmentData, setAssessmentData] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [emailRecipient, setEmailRecipient] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [pdfBase64, setPdfBase64] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchAssessmentData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'assessments'));
        const data = [];
        const years = new Set();

        querySnapshot.forEach(doc => {
          const docData = doc.data();
          const timestamp = docData.timestamp;

          let year = 'Unknown';
          if (timestamp && timestamp.toDate) {
            year = timestamp.toDate().getFullYear().toString();
          }

          data.push({ ...docData, year });
          if (year !== 'Unknown') years.add(year);
        });

        setAssessmentData(data);
        setAvailableYears([...years].sort());
        data.sort((a, b) => a.timestamp - b.timestamp);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching assessments:', error);
        setIsLoading(false);
      }
    };

    fetchAssessmentData();

    // Fetch email recipient from localStorage
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      setEmailRecipient(userEmail);
    }
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF('landscape');
    const tableData = assessmentData.map((data) => {
      const phase3 = data.phase3 || {};
      const phase4 = data.phase4 || {};
      return [
        data.timestamp || 'N/A',
        phase3.affectedAsset || 'N/A',
        phase3.areaOfConcern || 'N/A',
        phase3.likelihood || 'N/A',
        phase3.threatScenario || 'N/A',
        phase4.impactAreas ? Object.keys(phase4.impactAreas).join(', ') : 'N/A',
        phase4.impactLevel || 'N/A',
        phase4.mitigationApproach || 'N/A'
      ];
    });

    const columns = [
      'Timestamp',
      'Affected Asset', 
      'Area of Concern', 
      'Likelihood', 
      'Threat Scenario', 
      'Impact Area', 
      'Impact Level', 
      'Mitigation Approach'
    ];

    doc.autoTable({
      head: [columns],
      body: tableData,
      startY: 20,
      theme: 'grid',
      margin: { top: 10, left: 10, right: 10, bottom: 10 },
      headStyles: {
        fillColor: [10, 5, 51],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      bodyStyles: {
        fillColor: [122, 101, 201],
        textColor: [255, 255, 255],
      },
    });

    const pdfOutput = doc.output('datauristring');
    setPdfBase64(pdfOutput);
    doc.save('result.pdf');
  };

  const sendEmail = () => {
    if (!pdfBase64) {
      console.log('No PDF generated. Please generate PDF first.');
      return;
    }

    const templateParams = {
      to_email: emailRecipient,
      subject: 'Department Security Risk Assessment Report',
      message: 'Please find the attached assessment PDF.',
      attachment: [
        {
          filename: 'result.pdf',
          content: pdfBase64.split(',')[1],  // Extract Base64 content
          encoding: 'base64',
        },
      ],
    };

    emailjs
      .send(
        'service_7p0dlrb',
        'template_3o3mg21',
        templateParams,
        'fRH3TE4VuREKWpIlT'
      )
      .then(
        (response) => {
          console.log('Email sent successfully!', response.status, response.text);
          setShowPopup(true); // Show success popup
        },
        (error) => {
          console.log('Failed to send email:', error);
        }
      );
  };

  const handleSendEmail = () => {
    if (!pdfBase64) {
      console.log('Generating PDF...');
      downloadPDF();  
    } else {
      sendEmail();  
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      <Navbar />
      <div className="department">
        <div className="department-container">
          <h1>Department Security Risk Assessment</h1>
          
          <label htmlFor="year">Select Year:</label>
          <select 
            id="year" 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">All Years</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          {isLoading ? (
            <p>Loading data...</p>
          ) : (
            <table className="result-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Affected Asset</th>
                  <th>Area of Concern</th>
                  <th>Likelihood</th>
                  <th>Threat Scenario</th>
                  <th>Impact Area</th>
                  <th>Impact Level</th>
                  <th>Mitigation Approach</th>
                </tr>
              </thead>
              <tbody>
                {assessmentData
                  .filter((data) => selectedYear === '' || data.year === selectedYear)
                  .map((data, index) => {
                    const phase3 = data.phase3 || {};
                    const phase4 = data.phase4 || {};
                    const timestamp = data.timestamp ? data.timestamp.toDate().toLocaleString() : 'N/A';

                    return (
                      <tr key={index}>
                        <td>{timestamp}</td>
                        <td>{phase3.affectedAsset || 'N/A'}</td>
                        <td>{phase3.areaOfConcern || 'N/A'}</td>
                        <td>{phase3.likelihood || 'N/A'}</td>
                        <td>{phase3.threatScenario || 'N/A'}</td>
                        <td>{phase4.impactAreas ? Object.keys(phase4.impactAreas).join(', ') : 'N/A'}</td>
                        <td>{phase4.impactLevel || 'N/A'}</td>
                        <td>{phase4.mitigationApproach || 'N/A'}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}

          <div className='button'>
                <button onClick={downloadPDF} disabled={isLoading}>
                    <img src={download} alt="Download" /> Download PDF
                </button>
                <button onClick={handleSendEmail} disabled={isLoading}>
                  <img src={email} alt="Email" /> Send via Email
                </button>
          </div>

          {showPopup && (
            <div className="popup">
              <div className="popup-content">
                <h3>Email sent successfully!</h3>
                <button onClick={closePopup}>Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='footer'>
            &copy; 2025 RiskAnalyze. All Rights Reserved.
        </div>
    </div>
  );
};

export default Department;
