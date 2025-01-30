import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import './assesment.css';
import { useNavigate } from 'react-router-dom';

const Assesment = () => {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(''); 
  const navigate = useNavigate();

  const handleSaveForm = () => {
    console.log("Form saved");
  };

  const handleNextForm = () => {
    if (currentPhase < 4) {
      setCurrentPhase(currentPhase + 1); // Go to next phase
    }
  };

  const handlePrevForm = () => {
    if (currentPhase > 1) {
      setCurrentPhase(currentPhase - 1); // Go to previous phase
    }
  };

  const handleAssetSelection = (asset) => {
    // Logic for handling asset selection from Phase 2
    console.log("Selected asset:", asset);
    setAssets(prevAssets => [...prevAssets, asset]); // Store selected assets (Example logic)
  };

  const goToResult = () => {
    navigate('/result');  // Navigate to the result page
  };

  return (
    <div className="assess-container">
      <Navbar />
      {currentPhase === 1 && (
        <form id="phase-form1">
          <h2>Phase 1: Establish Focus</h2>
          
          <label htmlFor="criteria-name">Risk Measurement Criteria:</label>
          <input 
            type="text" 
            id="criteria-name" 
            name="criteria-name" 
            placeholder="Enter a concise name for the risk criteria (e.g., 'Data Integrity Risk')" 
            required 
          /><br /><br />
          
          <label htmlFor="criteria-description">Description of Criteria:</label>
          <textarea 
            id="criteria-description" 
            name="criteria-description" 
            rows="4" 
            cols="50" 
            placeholder="Provide a detailed explanation of the criteria. Explain the scope and purpose of this criterion for assessing risks. (e.g., 'Risks related to data consistency and accuracy')." 
            required 
          ></textarea><br /><br />
          
          <label htmlFor="priority-level">Priority Level:</label>
          <select id="priority-level" name="priority-level">
            <option value="" disabled selected>Select priority level</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select><br /><br />
          
          <div>
            <button type="button" id="save-form" onClick={handleSaveForm}>Save Form</button>
            <button type="button" id="next-form" onClick={handleNextForm}>Next</button>
          </div>
        </form>
      )}

      {currentPhase === 2 && (
        <form id="phase-form2">
          <h2>Phase 2: Profile Assets</h2>
          
          <label htmlFor="asset-name">Asset Name:</label>
          <input 
            type="text" 
            id="asset-name" 
            name="asset-name" 
            placeholder="Enter the name of the asset (e.g., 'Main Database Server')." 
            required 
          /><br /><br />
          
          <label htmlFor="asset-description">Asset Description:</label>
          <textarea 
            id="asset-description" 
            name="asset-description" 
            rows="4" 
            cols="50" 
            placeholder="Provide a description of the asset. Describe the asset, including its function and importance. (e.g., 'A physical server hosting the production database')." 
            required 
          ></textarea><br /><br />
          
          <label htmlFor="container-type">Container Type:</label>
          <select id="container-type" name="container-type">
            <option value="" disabled selected>Select container type</option>
            <option value="physical">Physical</option>
            <option value="technical">Technical</option>
            <option value="people">People</option>
          </select><br /><br />
          
          <div>
            <label htmlFor="importance-level">Importance Level:</label>
            <span id="importance-level-value">3</span>
          </div>

          <input type="range" id="importance-level" name="importance-level" min="1" max="5" step="1" /><br />
          <small>*Rate the criticality of this asset from 1 (least critical) to 5 (most critical).</small>
          <br /><br />
          
          <div>
            <button type="button" id="prev-form" onClick={handlePrevForm}>Previous</button>
            <button type="button" id="save-form" onClick={handleSaveForm}>Save Form</button>
            <button type="button" id="next-form" onClick={handleNextForm}>Next</button>
          </div>
        </form>
      )}

      {currentPhase === 3 && (
        <form id="phase-form3">
          <h2>Phase 3: Identify Threats</h2>
          
          <label htmlFor="area-of-concern">Area of Concern:</label>
          <input 
            type="text" 
            id="area-of-concern" 
            name="area-of-concern" 
            placeholder="Specify the area of concern (e.g., 'Unauthorized Access')." 
            required 
          /><br /><br />
          
          <label htmlFor="threat-scenario">Threat Scenario Description:</label>
          <textarea 
            id="threat-scenario" 
            name="threat-scenario" 
            rows="4" 
            cols="50" 
            placeholder="Describe the potential threat scenario. Provide details about how the threat could occur. (e.g., 'An unauthorized user gaining access to sensitive data')." 
            required 
          ></textarea><br /><br />
          
          <label htmlFor="affected-asset">Affected Asset:</label>
          <select id="affected-asset" name="affected-asset">
            {assets.map((asset, index) => (
              <option key={index} value={asset}>{asset}</option>
            ))}
          </select><br /><br />
          
          <div>
            <label htmlFor="likelihood">Likelihood of Threat:</label>
            <span id="importance-level-value">3</span>
          </div>

          <input type="range" id="likelihood" name="likelihood" min="1" max="5" step="1" /><br />
          <small>*Rate the likelihood of this threat occurring from 1 (least likely) to 5 (most likely).</small>
          <br /><br />
          
          <div>
            <button type="button" id="prev-form" onClick={handlePrevForm}>Previous</button>
            <button type="button" id="save-form" onClick={handleSaveForm}>Save Form</button>
            <button type="button" id="next-form" onClick={handleNextForm}>Next</button>
          </div>
        </form>
      )}

      {currentPhase === 4 && (
        <form id="phase-form4">
          <h2>Phase 4: Risk Mitigation</h2>
          
          <label htmlFor="associated-asset">Associated Asset:</label>
          <select id="associated-asset" name="associated-asset">
            {assets.map((asset, index) => (
              <option key={index} value={asset}>{asset}</option>
            ))}
          </select><br /><br />
          
          <label htmlFor="impact-level">Risk Impact Level:</label>
          <select id="impact-level" name="impact-level">
            <option value="" disabled selected>Select impact level</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select><br /><br />
          
          <h3>Impact Areas</h3>
          <small>How severe are these consequences to the organization or asset owner by impact area? <br /> 
          Rate the criticality of this impact area from 1 (least impacted) to 10 (most impacted).
          </small>
          <table id='impact-areas'>
            <tr>
              <th>Impact Area</th>
              <th>Value (1-10)</th>
            </tr>
            <tr>
              <td>Reputation & Customer Confidence</td>
              <td><input type="number" id="impact-reputation" name="impact-reputation" min="1" max="10" required /></td>
            </tr>
            <tr>
              <td>Financial</td>
              <td><input type="number" id="impact-financial" name="impact-financial" min="1" max="10" required /></td>
            </tr>
            <tr>
              <td>Productivity</td>
              <td><input type="number" id="impact-productivity" name="impact-productivity" min="1" max="10" required /></td>
            </tr>
            <tr>
              <td>Safety & Health</td>
              <td><input type="number" id="impact-safety" name="impact-safety" min="1" max="10" required /></td>
            </tr>
            <tr>
              <td>Fines & Legal Penalties</td>
              <td><input type="number" id="impact-legal" name="impact-legal" min="1" max="10" required /></td>
            </tr>
          </table><br />
          
          <label htmlFor="mitigation-approach">Mitigation Approach:</label>
          <textarea 
            id="mitigation-approach" 
            name="mitigation-approach" 
            rows="4" 
            cols="50" 
            placeholder="Describe the approach to mitigate the risk. Explain the steps or strategies to reduce the risk or its impact. (e.g., 'Implement a backup and recovery plan')." 
            required 
          ></textarea><br /><br />
          
          <div className="button-container">
            <button type="button" id="prev-form" onClick={handlePrevForm}>Previous</button>
            <button type="button" id="save-form" onClick={handleSaveForm}>Save Form</button>
            <button type="button" id="summary-form" onClick={goToResult}>Go To Summary</button>
          </div>
        </form>
      )}
      <div className="footer">
        &copy; 2025 RiskAnalyze. All Rights Reserved.
      </div>
    </div>
  );
};

export default Assesment;
