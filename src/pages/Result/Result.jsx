import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import './Result.css';
import email from '../../assets/email.svg';
import download from '../../assets/download.svg';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; 
import emailjs from 'emailjs-com';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Result = () => {
  const [emailRecipient, setEmailRecipient] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [assessmentData, setAssessmentData] = useState([]);
  
  useEffect(() => {
    const fetchAssessmentData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'assessments'));
        const data = [];
        querySnapshot.forEach(doc => {
          data.push(doc.data()); 
        });
        setAssessmentData(data); 
      } catch (error) {
        console.error('Error fetching assessments:', error);
      }
    };

    fetchAssessmentData();
    
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
        phase3.affectedAsset || 'N/A',
        phase3.areaOfConcern || 'N/A',
        phase3.likelihood || 'N/A',
        phase3.threatScenario || 'N/A',
        phase4.impactAreas ? Object.keys(phase4.impactAreas).join(', ') : 'N/A',
        phase4.impactLevel || 'N/A',
        phase4.mitigationApproach || 'N/A'
      ];
    });

    // Tentukan kolom tabel
    const columns = [
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
        textColor: [0, 0, 0],
      }
    });

    doc.save('result.pdf');
  };

  const sendEmail = () => {
    const templateParams = {
      to_email: emailRecipient,
      subject: 'Result PDF from RiskAnalyze',
      message: 'Please find the attached result PDF from RiskAnalyze.',
      attachment: '',
    };

    emailjs
      .send(
        'service_c9igmco',
        'template_3o3mg21',
        templateParams,
        'fRH3TE4VuREKWpIlT'
      )
      .then(
        (response) => {
          console.log('Email successfully sent!', response.status, response.text);
          setShowPopup(true); 
        },
        (error) => {
          console.log('Failed to send email:', error);
        }
      );
  };

  const closePopup = () => {
    setShowPopup(false); 
  };

  return (
    <div className='result'>
      <Navbar />
      <div className='result-form'>
        <div className='result-nih'>
          <h1>Security Risk Assessment Report</h1>

          <table className="result-table">
            <thead>
              <tr>
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
              {assessmentData.map((data, index) => {
                const phase3 = data.phase3 || {};
                const phase4 = data.phase4 || {};
                return (
                  <tr key={index}>
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
        </div>

        <div className='button'>
          <button onClick={downloadPDF}>
            <img src={download} alt="Download" /> Download PDF
          </button>
          <button onClick={sendEmail}>
            <img src={email} alt="Email" /> Send via Email
          </button>
        </div>

        {showPopup && (
          <div className="popup">
            <span>Email sent successfully!</span>
            <button onClick={closePopup}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Result;
