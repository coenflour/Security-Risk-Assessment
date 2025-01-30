import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import './Result.css';
import email from '../../assets/email.svg';
import download from '../../assets/download.svg';
import { jsPDF } from 'jspdf';
import emailjs from 'emailjs-com';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Result = () => {
  const [emailRecipient, setEmailRecipient] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [assessmentData, setAssessmentData] = useState([]);
  
  // Fetch stored assessment data from Firestore
  useEffect(() => {
    const fetchAssessmentData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'assessments'));
        const data = [];
        querySnapshot.forEach(doc => {
          data.push(doc.data()); // Push the assessment data
        });
        setAssessmentData(data); // Set the assessment data state
      } catch (error) {
        console.error('Error fetching assessments:', error);
      }
    };

    fetchAssessmentData();
    
    // Get the user's email from local storage
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      setEmailRecipient(userEmail); // Set email
    }
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF('landscape');
    const content = document.querySelector('.result-nih');

    doc.html(content, {
      callback: function (doc) {
        doc.save('result.pdf');
      },
      margin: [10, 10, 10, 10],
      x: 10,
      y: 10,
    });
  };

  const sendEmail = () => {
    const templateParams = {
      to_email: emailRecipient,
      subject: 'Result PDF from RiskAnalyze',
      message: 'Please find the attached result PDF from RiskAnalyze.',
      attachment: '', // You may include a base64 attachment if needed
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
          setShowPopup(true); // Show popup when email is sent
        },
        (error) => {
          console.log('Failed to send email:', error);
        }
      );
  };

  const closePopup = () => {
    setShowPopup(false); // Close popup when clicked
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
