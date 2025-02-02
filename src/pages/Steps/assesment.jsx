import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import './assesment.css';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';  
import { collection, addDoc, updateDoc, doc, getDocs } from 'firebase/firestore'; 
import { getAuth, updateProfile } from 'firebase/auth';

const Assesment = () => {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [docId, setDocId] = useState('');
  const [formData, setFormData] = useState({
    phase1: {
      criteriaName: '',
      criteriaDescription: '',
      priorityLevel: ''
    },
    phase2: {
      assetName: '',
      assetDescription: '',
      containerType: '',
      importanceLevel: 3
    },
    phase3: {
      areaOfConcern: '',
      threatScenario: '',
      affectedAsset: '',
      likelihood: 3
    },
    phase4: {
      associatedAsset: '',
      impactLevel: '',
      impactAreas: {
        reputation: 1,
        financial: 1,
        productivity: 1,
        safety: 1,
        legal: 1
      },
      mitigationApproach: ''
    }
  });

  const [showPopup, setShowPopup] = useState(false); 
  const navigate = useNavigate();

  const handleSaveForm = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser; 

      const { uid } = user;
      const assessmentsRef = collection(db, 'users', uid, 'assessments');
      const newAssessmentRef = doc(assessmentsRef, `assessment_${Date.now()}`);

      if (!docId) {
        const docRef = await addDoc(collection(db, 'assessments'), {
          phase1: formData.phase1,
          phase2: formData.phase2,
          phase3: formData.phase3,
          phase4: formData.phase4,
          user: { uid }, 
          timestamp: new Date()
        });
        setDocId(docRef.id);
        console.log('Form data saved to Firestore with docId:', docRef.id);
      } else {
        await updateDoc(doc(db, 'assessments', docId), {
          phase1: formData.phase1,
          phase2: formData.phase2,
          phase3: formData.phase3,
          phase4: formData.phase4,
          user: { uid }, 
          timestamp: new Date()
        });
        console.log('Form data updated in Firestore for docId:', newAssessmentRef.id);
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false); 
        }, 3000);
      }
    } catch (error) {
      console.error('Error saving or updating form data:', error);
    }
  };

  const handleNextForm = () => {
    if (currentPhase < 4) {
      setCurrentPhase(currentPhase + 1); 
    }
  };

  const handlePrevForm = () => {
    if (currentPhase > 1) {
      setCurrentPhase(currentPhase - 1);
    }
  };
  const goToResult = () => {
    navigate('/Mine'); 
  };
  const handleSubmit = () => {
    const newAssessment = {
        id: Date.now(),
        title: areaOfConcern, 
        date: new Date().toLocaleDateString(),
        system: selectedSystem, 
        riskLevel: selectedRiskLevel,
        status: "In Progress"
    };

    const existingData = JSON.parse(localStorage.getItem("assessments")) || [];
    existingData.push(newAssessment);
    localStorage.setItem("assessments", JSON.stringify(existingData));
  };


  const handleAddAsset = async () => {
    const newAsset = formData.phase2.assetName.trim();
  
    if (newAsset !== '' && !assets.includes(newAsset)) {
      try {
        await addDoc(collection(db, 'assessments'), {
          phase2: { assetName: newAsset },
          timestamp: new Date()
        });
        console.log("Asset added to Firestore:", newAsset);
  
        setAssets(prevAssets => [...prevAssets, newAsset]);
  
      } catch (error) {
        console.error("Error adding asset to Firestore:", error);
      }
    } else {
      console.log("Asset already exists or is empty:", newAsset);
    }
  
    setFormData({
      ...formData,
      phase2: { assetName: '', assetDescription: '', containerType: '', importanceLevel: 3 }
    });
  };
  
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'assessments'));
        const allAssets = [];
  
        querySnapshot.forEach((doc) => {
          if (doc.data().phase2 && doc.data().phase2.assetName) {
            allAssets.push(doc.data().phase2.assetName);
          }
        });
        setAssets(allAssets);
      } catch (error) {
        console.error("Error fetching assets from Firestore:", error);
      }
    };
  
    fetchAssets();
  }, []);
  
  return (
    <div className="assess-container">
      <Navbar />
      
      {/* Phase 1: Establish Focus */}
      {currentPhase === 1 && (
        <form id="phase-form1">
          <h2>Phase 1: Establish Focus</h2>
          <label htmlFor="criteria-name">Risk Measurement Criteria:</label>
          <input 
            type="text" 
            id="criteria-name" 
            name="criteria-name" 
            placeholder="Enter a concise name for the risk criteria" 
            value={formData.phase1.criteriaName} 
            onChange={(e) => setFormData({ ...formData, phase1: { ...formData.phase1, criteriaName: e.target.value } })} 
            required 
          /><br /><br />
          
          <label htmlFor="criteria-description">Description of Criteria:</label>
          <textarea 
            id="criteria-description" 
            name="criteria-description" 
            rows="4" 
            cols="50" 
            placeholder="Provide a detailed explanation of the criteria" 
            value={formData.phase1.criteriaDescription}
            onChange={(e) => setFormData({ ...formData, phase1: { ...formData.phase1, criteriaDescription: e.target.value } })} 
            required 
          ></textarea><br /><br />
          
          <label htmlFor="priority-level">Priority Level:</label>
          <select 
            id="priority-level" 
            name="priority-level" 
            value={formData.phase1.priorityLevel}
            onChange={(e) => setFormData({ ...formData, phase1: { ...formData.phase1, priorityLevel: e.target.value } })}
          >
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

      {/* Phase 2: Profile Assets */}
      {currentPhase === 2 && (
        <form id="phase-form2">
          <h2>Phase 2: Profile Assets</h2>
          <label htmlFor="asset-name">Asset Name:</label>
          <input 
            type="text" 
            id="asset-name" 
            name="asset-name" 
            placeholder="Enter the name of the asset" 
            value={formData.phase2.assetName}
            onChange={(e) => setFormData({ ...formData, phase2: { ...formData.phase2, assetName: e.target.value } })} 
            required 
          /><br /><br />
          
          <label htmlFor="asset-description">Asset Description:</label>
          <textarea 
            id="asset-description" 
            name="asset-description" 
            rows="4" 
            cols="50" 
            placeholder="Provide a description of the asset" 
            value={formData.phase2.assetDescription}
            onChange={(e) => setFormData({ ...formData, phase2: { ...formData.phase2, assetDescription: e.target.value } })} 
            required 
          ></textarea><br /><br />
          
          <label htmlFor="container-type">Container Type:</label>
          <select 
            id="container-type" 
            name="container-type" 
            value={formData.phase2.containerType}
            onChange={(e) => setFormData({ ...formData, phase2: { ...formData.phase2, containerType: e.target.value } })}
          >
            <option value="" disabled selected>Select container type</option>
            <option value="physical">Physical</option>
            <option value="technical">Technical</option>
            <option value="people">People</option>
          </select><br /><br />
          
          <div>
            <label htmlFor="importance-level">Importance Level:</label>
            <span id="importance-level-value">{formData.phase2.importanceLevel}</span>
          </div>
          <input 
            type="range" 
            id="importance-level" 
            name="importance-level" 
            min="1" 
            max="5" 
            step="1" 
            value={formData.phase2.importanceLevel}
            onChange={(e) => setFormData({ ...formData, phase2: { ...formData.phase2, importanceLevel: e.target.value } })}
          /><br />
          <small>*Rate the criticality of this asset from 1 (least critical) to 5 (most critical).</small>
          <br /><br />
          
          <div>
            <button type="button" id="prev-form" onClick={handlePrevForm}>Previous</button>
            <button type="button" id="save-form" onClick={handleSaveForm}>Save Form</button>
            <button type="button" id="next-form" onClick={handleNextForm}>Next</button>
          </div>
        </form>
      )}

      {/* Phase 3: Identify Threats */}
      {currentPhase === 3 && (
        <form id="phase-form3" onSubmit={handleSubmit}>
          <h2>Phase 3: Identify Threats</h2>
          
          <label htmlFor="area-of-concern">Area of Concern:</label>
          <input 
            type="text" 
            id="area-of-concern" 
            name="area-of-concern" 
            placeholder="Specify the area of concern" 
            value={formData.phase3.areaOfConcern}
            onChange={(e) => setFormData({ ...formData, phase3: { ...formData.phase3, areaOfConcern: e.target.value } })}
            required 
          /><br /><br />
          
          <label htmlFor="threat-scenario">Threat Scenario Description:</label>
          <textarea 
            id="threat-scenario" 
            name="threat-scenario" 
            rows="4" 
            cols="50" 
            placeholder="Describe the potential threat scenario" 
            value={formData.phase3.threatScenario}
            onChange={(e) => setFormData({ ...formData, phase3: { ...formData.phase3, threatScenario: e.target.value } })}
            required 
          ></textarea><br /><br />
          
          <label htmlFor="affected-asset">Affected Asset:</label>
          {console.log("Assets in Phase 3:", assets)}
          <select
            id="affected-asset"
            name="affected-asset"
            value={formData.phase3.affectedAsset}
            onChange={(e) => setFormData({
              ...formData,
              phase3: { ...formData.phase3, affectedAsset: e.target.value }
            })}
          >
            <option value="" disabled>Select an asset</option>
            {assets.length > 0 ? (
              assets.map((asset, index) => (
                <option key={index} value={asset}>{asset}</option>
              ))
            ) : (
              <option>No assets available</option>
            )}
          </select> <br /><br />
          
          <div>
            <label htmlFor="likelihood">Likelihood of Threat:</label>
            <span id="likelihood-value">{formData.phase3.likelihood}</span>
          </div>
          <input 
            type="range" 
            id="likelihood" 
            name="likelihood" 
            min="1" 
            max="5" 
            step="1" 
            value={formData.phase3.likelihood}
            onChange={(e) => setFormData({
              ...formData,
              phase3: { ...formData.phase3, likelihood: e.target.value }
            })}
          /><br />
          <small>*Rate the likelihood of this threat from 1 (least likely) to 5 (most likely).</small>
          <br /><br />

          <div>
            <button type="button" id="prev-form" onClick={handlePrevForm}>Previous</button>
            <button type="button" id="save-form" onClick={handleSaveForm}>Save Form</button>
            <button type="button" id="next-form" onClick={handleNextForm}>Next</button>
          </div>
        </form>
      )}

      {/* Phase 4: Impact Assessment */}
      {currentPhase === 4 && (
        <form id="phase-form4">
          <h2>Phase 4: Impact Assessment</h2>
          
          <label htmlFor="associated-asset">Associated Asset:</label>
          <select
            id="associated-asset"
            name="associated-asset"
            value={formData.phase4.associatedAsset}
            onChange={(e) => setFormData({
              ...formData,
              phase4: { ...formData.phase4, associatedAsset: e.target.value }
            })}
          >
            <option value="" disabled>Select an asset</option>
            {assets.map((asset, index) => (
              <option key={index} value={asset}>{asset}</option>
            ))}
          </select><br /><br />
          
          <label htmlFor="impact-level">Impact Level:</label>
          <select 
            id="impact-level" 
            name="impact-level" 
            value={formData.phase4.impactLevel}
            onChange={(e) => setFormData({
              ...formData,
              phase4: { ...formData.phase4, impactLevel: e.target.value }
            })}
          >
            <option value="" disabled>Select impact level</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select><br /><br />
          
          <div>
            <h4>Impact Areas:</h4>
            {['reputation', 'financial', 'productivity', 'safety', 'legal'].map((area) => (
              <div key={area}>
                <label htmlFor={`${area}-impact`}>{`${area.charAt(0).toUpperCase() + area.slice(1)} Impact Level:`}</label>
                <input 
                  type="range" 
                  id={`${area}-impact`} 
                  name={`${area}-impact`} 
                  min="1" 
                  max="5" 
                  step="1" 
                  value={formData.phase4.impactAreas[area]}
                  onChange={(e) => setFormData({
                    ...formData,
                    phase4: { 
                      ...formData.phase4, 
                      impactAreas: { 
                        ...formData.phase4.impactAreas,
                        [area]: e.target.value
                      }
                    }
                  })}
                />
                <span>{formData.phase4.impactAreas[area]}</span><br /><br />
              </div>
            ))}
          </div>

          <label htmlFor="mitigation-approach">Mitigation Approach:</label>
          <textarea 
            id="mitigation-approach" 
            name="mitigation-approach" 
            rows="4" 
            cols="50" 
            placeholder="Describe your mitigation approach"
            value={formData.phase4.mitigationApproach}
            onChange={(e) => setFormData({
              ...formData,
              phase4: { ...formData.phase4, mitigationApproach: e.target.value }
            })}
          ></textarea><br /><br />

          <div>
            <button type="button" id="prev-form" onClick={handlePrevForm}>Previous</button>
            <button type="button" id="save-form" onClick={handleSaveForm}>Save Form</button>
            <button type="button" id="submit-form" onClick={goToResult}>Submit</button>
          </div>
        </form>
      )}
      {showPopup && <div className="popup">Form saved successfully!</div>}
      <div className='footer'>
        &copy; 2025 RiskAnalyze. All Rights Reserved.
      </div>
    </div>
  );
};

export default Assesment;
