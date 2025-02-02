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
import { getAuth } from 'firebase/auth';

const Result = () => {
  const [emailRecipient, setEmailRecipient] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [assessmentData, setAssessmentData] = useState([]);
  const [pdfBase64, setPdfBase64] = useState('');  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssessmentData = async () => {
      try {
        const user = getAuth().currentUser;
        if (user) {
          const userUid = user.uid;  
          const querySnapshot = await getDocs(
            collection(db, 'assessments')
          );
          
          const data = [];
          querySnapshot.forEach(doc => {
            const docData = doc.data();
  
            if (docData.user?.uid === userUid) {
              let formattedTimestamp = 'N/A';
              if (docData.timestamp && docData.timestamp.toDate) {
                formattedTimestamp = docData.timestamp.toDate().toLocaleString();
              }
  
              data.push({ id: doc.id, ...docData, timestamp: formattedTimestamp });
            }
          });
  
          data.sort((a, b) => a.timestamp - b.timestamp);
          setAssessmentData(data);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching assessments:', error);
        setIsLoading(false);
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
    console.log('PDF generated:', pdfOutput);  
    setPdfBase64(pdfOutput);  
    doc.save('result.pdf');
  };

  const sendEmail = () => {
    if (!pdfBase64) {
      console.log('No PDF generated. Please generate PDF first.');
      return;
    }
  
    console.log('Sending PDF:', pdfBase64);
  
    const templateParams = {
      to_email: emailRecipient,
      subject: 'Result PDF from RiskAnalyze',
      message: 'Please find the attached result PDF from RiskAnalyze.',
      attachment: [
        {
          filename: 'result.pdf',
          content: pdfBase64.split(',')[1],
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
          setShowPopup(true); 
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
    <div className='result'>
      <Navbar />
      <div className='result-form'>
        <div className='result-nih'>
          <h1>Security Risk Assessment Report</h1>

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
                {assessmentData.map((data, index) => {
                  const phase3 = data.phase3 || {};
                  const phase4 = data.phase4 || {};
                  return (
                    <tr key={index}>
                      <td>{data.timestamp || 'N/A'}</td>
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
        </div>

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
      <div className='footer'>
        &copy; 2025 RiskAnalyze. All Rights Reserved.
      </div>
    </div>
  );
};

export default Result;