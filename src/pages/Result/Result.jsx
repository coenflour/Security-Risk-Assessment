import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import './Result.css';
import email from '../../assets/email.svg';
import download from '../../assets/download.svg';
import { jsPDF } from 'jspdf';
import emailjs from 'emailjs-com';

const Result = () => {
  const [emailRecipient, setEmailRecipient] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  // Ambil email pengguna yang sudah login
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      setEmailRecipient(userEmail); // Set email pengguna yang login
    }
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();
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
          setShowPopup(true); // Tampilkan popup saat email berhasil dikirim
        },
        (error) => {
          console.log('Failed to send email:', error);
        }
      );
  };

  const closePopup = () => {
    setShowPopup(false); // Menutup popup ketika tombol close diklik
  };

  return (
    <div className='result'>
      <Navbar />
      <div className='result-form'>
        <div className='result-nih'>
          {/* Isi konten untuk hasil di sini */}
        </div>
        <div className='button'>
          <div className='email'>
            <button onClick={sendEmail}>
              <img src={email} alt="email" />
              Send to email
            </button>
          </div>
          <div className='pdf'>
            <button onClick={downloadPDF}>
              <img src={download} alt="download" />
              Download PDF
            </button>
          </div>
        </div>
      </div>
      <div className='footer'>
        &copy; 2025 RiskAnalyze. All Rights Reserved.
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className='popup'>
          <div className='popup-content'>
            <h3>Email successfully sent!</h3>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Result;
