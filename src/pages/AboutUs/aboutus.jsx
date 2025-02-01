import React, { useEffect, useState } from 'react';
import './aboutus.css';
import Navbar from '../../components/Navbar';
import emailjs from 'emailjs-com';
import { toast, ToastContainer } from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css';

const AboutUs = () => {
  const [userEmail, setUserEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showPopup, setShowPopup] = useState(false);  

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!userEmail || !/\S+@\S+\.\S+/.test(userEmail)) {
      alert('Please enter a valid email address!');
      return;
    }
    const templateParams = {
      email: userEmail,
    };

    emailjs.send('service_7p0dlrb', 'template_8tial2z', templateParams, 'fRH3TE4VuREKWpIlT')
      .then((response) => {
        console.log('Email sent successfully:', response);
        setSubscribed(true);
        toast.success(`Thank you for subscribing with ${userEmail}!`);  
        setShowPopup(true);
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
        toast.error('Something went wrong. Please try again later.');
      });
  };

  const closePopup = () => {
    setShowPopup(false); 
  };

  return (
    <div>
      <Navbar />
      <div className="container1">
        <h1>About RiskAnalyze</h1>

        <div className="content1">
          <div className="box">
            <h2>Our Purpose</h2>
            <p>
              "Cyber Threats Meet AI Defense". RiskAnalyze is an advanced AI-powered security risk assessment platform
              designed to detect and analyze cyber threats in real-time. Our mission is to help businesses and individuals
              stay ahead of potential security risks with intelligent AI-driven solutions, ensuring that your digital assets
              remain safe, secure, and resilient against cyber threats. <br /><br /> Here's our website's main features:
              <br /> ⦿ AI-Powered Threat Detection
              <br /> ⦿ Real-Time Risk Assessment
              <br /> ⦿ User-Friendly Dashboard
            </p>
          </div>

          <div className="box">
            <h2>Meet the Developers</h2>
            <p>Here's the team from President University, majoring in Informatics, specifically class of Cyber Security - 1 Batch 2023.</p>
            <ul className="dev-list">
              <li>Alia Nurul Aziiza</li>
              <li>Anggela F Syaloomitha Taek</li>
              <li>Nadifah Aulia Rahmani</li>
              <li>Shofiyyah Abidah Marpaung</li>
              <li>Zafyra R. Azhari</li>
            </ul>
          </div>

          <div className="box">
            <h2>Contact Us</h2>
            <p>Email: support@riskanalyze.com <br /> Phone: +62 (021) 85857676</p>

            <div className="newsletter">
              <h3>Sign Up for Our Newsletter</h3>
              <p>Get the latest info about <br /> Cyber Security Risks!</p>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={userEmail} 
                onChange={(e) => setUserEmail(e.target.value)} 
                required 
              />
              <button onClick={handleSubscribe}>Subscribe</button>
            </div>
          </div>
        </div>
      </div>
      <div className="footer">
          &copy; 2025 RiskAnalyze. All Rights Reserved.
      </div>

      {/* Popup notification */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Subscription Successful!</h3>
            <p>Thank you for subscribing, {userEmail}!</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default AboutUs;
