import { db } from "./firebase-init.js";
import { collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("phase-form");
    const saveButton = document.getElementById("save-form");
    const nextButton = document.getElementById("next-form");
    const prevButton = document.getElementById("prev-form");

    let isDataSaved = false; // Track whether data is saved

    // Update range value display
    const updateRangeValue = (rangeInputId, displaySpanId) => {
        const rangeInput = document.getElementById(rangeInputId);
        const displaySpan = document.getElementById(displaySpanId);
        if (rangeInput && displaySpan) {
            displaySpan.textContent = rangeInput.value; // Set initial value

            // Update value on input change
            rangeInput.addEventListener("input", () => {
                displaySpan.textContent = rangeInput.value;
            });
        }
    };

    // Call the function for each range input in the form
    updateRangeValue("importance-level", "importance-level-value"); // For Phase 2
    updateRangeValue("likelihood", "likelihood-value"); // For Phase 3

    // Save form data to Firestore
    const saveToFirestore = async (phase, data) => {
        try {
            const docRef = await addDoc(collection(db, "phases"), {
                phase: phase,
                ...data,
                timestamp: new Date()
            });
            alert(`Data for Phase ${phase} saved successfully to Firestore!`);
            isDataSaved = true; // Mark data as saved
        } catch (error) {
            console.error("Error saving data to Firestore:", error);
            alert("Error saving data. Please try again.");
            isDataSaved = false; // Mark data as not saved
        }
    };

    // Save form data to Firestore and local storage
    const saveFormData = async (phase) => {
        if (isDataSaved) return; // Prevent duplicate saves

        const formData = new FormData(form);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Save to Firestore
        await saveToFirestore(phase, data);

        // Optionally save to local storage
        localStorage.setItem(`phase-${phase}-data`, JSON.stringify(data));
    };

    // Load form data from Firestore
    const loadFromFirestore = async (phase) => {
        try {
            const q = query(collection(db, "phases"), where("phase", "==", phase));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    for (const key in data) {
                        const input = form.querySelector(`[name="${key}"]`);
                        if (input) {
                            input.value = data[key];
                        }
                    }
                });
                isDataSaved = true; // Mark data as loaded and saved
            } else {
                console.log(`No data found for Phase ${phase}.`);
                isDataSaved = false; // No data loaded
            }
        } catch (error) {
            console.error("Error retrieving data from Firestore:", error);
            isDataSaved = false; // Mark data as not loaded
        }
    };

    // Navigate to the next phase
    const goToNextPhase = async (currentPhase) => {
        if (!isDataSaved) {
            alert("Please save the form data before proceeding to the next phase.");
            return;
        }
        window.location.href = `Phase${currentPhase + 1}.html`;
    };

    // Navigate to the previous phase
    const goToPrevPhase = (currentPhase) => {
        window.location.href = `Phase${currentPhase - 1}.html`;
    };

    // Populate dynamic dropdown (specific for Phase 3 and Phase 4)
    const populateDropdown = (dropdownId, sourcePhase) => {
        const dropdown = document.getElementById(dropdownId);
        const sourceData = JSON.parse(localStorage.getItem(`phase-${sourcePhase}-data`));
        if (sourceData && sourceData["asset-name"]) {
            const option = document.createElement("option");
            option.value = sourceData["asset-name"];
            option.textContent = sourceData["asset-name"];
            dropdown.appendChild(option);
        }
    };

    // Detect the current phase based on the title
    const phaseNumber = parseInt(document.title.match(/\d+/)[0], 10);

    // Attach event listeners to buttons
    if (saveButton) saveButton.addEventListener("click", async () => {
        await saveFormData(phaseNumber);
    });
    if (nextButton) nextButton.addEventListener("click", async () => {
        await goToNextPhase(phaseNumber);
    });
    if (prevButton) prevButton.addEventListener("click", () => goToPrevPhase(phaseNumber));

    // Load existing data for the current phase
    loadFromFirestore(phaseNumber);

    // Additional setup for specific phases
    if (phaseNumber === 3) {
        populateDropdown("affected-asset", 2); // Populate 'affected-asset' from Phase 2
    } else if (phaseNumber === 4) {
        populateDropdown("associated-asset", 2); // Populate 'associated-asset' from Phase 2

        // Ensure numerical inputs in Phase 4 are properly loaded
        const impactAreas = [
            "impact-reputation",
            "impact-financial",
            "impact-productivity",
            "impact-safety",
            "impact-legal"
        ];

        impactAreas.forEach(id => {
            const inputField = document.getElementById(id);
            if (inputField) {
                // Ensure it loads the saved value, if any
                const savedData = JSON.parse(localStorage.getItem(`phase-${phaseNumber}-data`));
                if (savedData && savedData[id]) {
                    inputField.value = savedData[id];
                }

                // Restrict values between 1 and 10
                inputField.addEventListener("input", () => {
                    if (inputField.value < 1) inputField.value = 1;
                    if (inputField.value > 10) inputField.value = 10;
                });
            }
        });
    }
});