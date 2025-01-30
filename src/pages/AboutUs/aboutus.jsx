import React from 'react';
import './aboutus.css';
import Navbar from '../../components/Navbar';

const AboutUs = () => {
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
              <input type="email" placeholder="Enter your email" required />
              <button type="submit">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
      <div className="footer">
          &copy; 2025 RiskAnalyze. All Rights Reserved.
      </div>
    </div>
  );
};

export default AboutUs;