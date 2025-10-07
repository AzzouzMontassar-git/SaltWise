document.addEventListener('DOMContentLoaded', function() {
    // Expert option listener (moved to top level to avoid duplicates)
    const expertOption = document.querySelector('input[name="result_option"][value="expert"]');
    const expertDetails = document.querySelector('.expert-details');
    if (expertOption && expertDetails) {
        expertOption.addEventListener('change', function() {
            expertDetails.style.display = this.checked ? 'block' : 'none';
        });
    }

    // Form navigation
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    let currentStep = 0;
    
    // Initialize first step
    showStep(currentStep);
    updateProgress();  // Fixed: Call updateProgress on init
    
    // Next button click handler
    document.querySelectorAll('.btn-next').forEach(button => {
        button.addEventListener('click', function() {
            if (validateStep(currentStep)) {
                currentStep++;
                showStep(currentStep);
                updateProgress();
                
                // If moving to the review step (step 3), update the summary
                if (currentStep === 2) {
                    updateSummary();
                }
            }
        });
    });
    
    // Previous button click handler
    document.querySelectorAll('.btn-prev').forEach(button => {
        button.addEventListener('click', function() {
            currentStep--;
            showStep(currentStep);
            updateProgress();
        });
    });
    
    // Show specific step
    function showStep(stepIndex) {
        formSteps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
    }
    
    // Update progress indicator
    function updateProgress() {
        progressSteps.forEach((step, index) => {
            step.classList.toggle('active', index <= currentStep);
        });
    }
    
    // Validate current step before proceeding
    function validateStep(stepIndex) {
        const currentStep = formSteps[stepIndex];
        const inputs = currentStep.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#ff4444';
                isValid = false;
                
                // Add error message if not already present
                if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                    const errorMsg = document.createElement('p');
                    errorMsg.textContent = 'This field is required';
                    errorMsg.classList.add('error-message');
                    errorMsg.style.color = '#ff4444';
                    errorMsg.style.fontSize = '0.8rem';
                    errorMsg.style.marginTop = '0.3rem';
                    input.insertAdjacentElement('afterend', errorMsg);
                }
            } else {
                input.style.borderColor = '#e0e0e0';
                const errorMsg = input.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.remove();
                }
            }
        });
        
        return isValid;
    }
    
    // Update the summary section in step 3
    function updateSummary() {
        const summaryContainer = document.getElementById('inputSummary');
        summaryContainer.innerHTML = '';
        
        // Collect data from step 1
        const climate = document.getElementById('climate').value;
        const topography = document.getElementById('topography').value;
        const location = document.getElementById('location').value;
        const soil_type = document.getElementById('soil_type').value;  // Fixed: .value
        const salinity = document.getElementById('salinity').value;
        const existing_species = document.getElementById('existing_species').value;  // Fixed: .value
        
        // Create summary cards for step 1 data
        if (climate) summaryContainer.appendChild(createSummaryCard('Climate Zone', climate));
        if (topography) summaryContainer.appendChild(createSummaryCard('Topography', topography));
        if (location) summaryContainer.appendChild(createSummaryCard('Location', location));
        if (soil_type) summaryContainer.appendChild(createSummaryCard('Soil Texture', soil_type));  // Fixed: Use soil_type
        if (salinity) summaryContainer.appendChild(createSummaryCard('Salinity Index', `${salinity} dS/m`));
        if (existing_species) summaryContainer.appendChild(createSummaryCard('Existing Species', existing_species));  // Fixed: Use existing_species
        
        // Collect data from step 2
        const symptoms = Array.from(document.querySelectorAll('input[name="symptoms"]:checked'))
            .map(el => el.nextElementSibling.querySelector('span').textContent);
        const symptomsDesc = document.getElementById('symptoms_description').value;
        
        // Create summary cards for step 2 data
        if (symptoms.length > 0) {
            summaryContainer.appendChild(createSummaryCard('Observed Symptoms', symptoms.join(', ')));
        }
        if (symptomsDesc) {
            summaryContainer.appendChild(createSummaryCard('Additional Symptoms', symptomsDesc));
        }
    }
    
    // Helper function to create summary cards
    function createSummaryCard(title, value) {
        const card = document.createElement('div');
        card.className = 'summary-card';
        card.innerHTML = `
            <h4>${title}</h4>
            <p>${value}</p>
        `;
        return card;
    }
    
    // File upload handling
    document.getElementById('photoUpload').addEventListener('click', function() {
        document.getElementById('soil_photos').click();
    });
    
    document.getElementById('videoUpload').addEventListener('click', function() {
        document.getElementById('soil_video').click();
    });
    
    document.getElementById('pdfUpload').addEventListener('click', function() {
        document.getElementById('soil_analysis').click();
    });
    
    // Photo preview
    document.getElementById('soil_photos').addEventListener('change', function(e) {
        const preview = document.getElementById('photoPreview');
        preview.innerHTML = '';
        
        for (const file of e.target.files) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const img = document.createElement('img');
                    img.src = event.target.result;
                    preview.appendChild(img);
                };
                reader.readAsDataURL(file);
            } else {
                // Fixed: Add error feedback
                const error = document.createElement('p');
                error.textContent = `Invalid file type: ${file.name}`;
                error.style.color = '#ff4444';
                preview.appendChild(error);
            }
        }
    });
    
    // Video preview
    document.getElementById('soil_video').addEventListener('change', function(e) {
        const preview = document.getElementById('videoPreview');
        preview.innerHTML = '';
        
        for (const file of e.target.files) {  // Fixed: Loop for multiple files
            if (file.type.startsWith('video/')) {
                const video = document.createElement('video');
                video.src = URL.createObjectURL(file);
                video.controls = true;
                video.style.maxWidth = '100px';
                preview.appendChild(video);
            } else {
                // Fixed: Add error feedback
                const error = document.createElement('p');
                error.textContent = `Invalid file type: ${file.name}`;
                error.style.color = '#ff4444';
                preview.appendChild(error);
            }
        }
    });
    
    // PDF preview
    document.getElementById('soil_analysis').addEventListener('change', function(e) {
        const preview = document.getElementById('pdfPreview');
        preview.innerHTML = '';
        
        for (const file of e.target.files) {  // Fixed: Loop for multiple files
            if (file.type === 'application/pdf') {
                const p = document.createElement('p');
                p.textContent = `PDF file selected: ${file.name}`;
                preview.appendChild(p);
            } else {
                // Fixed: Add error feedback
                const error = document.createElement('p');
                error.textContent = `Invalid file type: ${file.name}`;
                error.style.color = '#ff4444';
                preview.appendChild(error);
            }
        }
    });
    
    // Form submission
    document.getElementById('diagnosticForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = document.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
        
        // Simulate processing delay
        setTimeout(() => {
            // Hide form and show results
            document.getElementById('diagnosticForm').style.display = 'none';
            document.getElementById('resultsSection').style.display = 'block';
            
            // Generate results based on form data
            generateResults();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
    
    // Generate diagnostic results
    function generateResults() {
        const resultsContent = document.getElementById('resultsContent');
        const analysisContent = document.getElementById('analysisContent');
        const resourcesContent = document.getElementById('resourcesContent');
        
        // Get form values
        const salinity = parseFloat(document.getElementById('salinity').value);
        const location = document.getElementById('location').value;
        const climate = document.getElementById('climate').value;
        const topography = document.getElementById('topography').value;
        const soil_type = document.getElementById('soil_type').value;
        const existing_species = document.getElementById('existing_species').value;
        const symptoms = Array.from(document.querySelectorAll('input[name="symptoms"]:checked'))
            .map(el => el.value);
        
        // Generate recommendations based on inputs
        let recommendationsHTML = '<h3>Soil Health Assessment</h3>';
        
        // Location and climate context
        recommendationsHTML += `
            <p>Based on your location (${location}) and <strong>${climate}</strong> climate, these recommendations are tailored for your region.</p>
        `;
        
        // Salinity analysis
        if (salinity > 1.5) {
            recommendationsHTML += `
                <div class="result-section">
                    <h4>High Salinity (${salinity} dS/m)</h4>
                    <p>Your soil has high salt content which can harm plants.</p>
                    <h5>Recommendations:</h5>
                    <ul>
                        <li>Improve drainage to help leach salts</li>
                        <li>Apply gypsum (calcium sulfate) to replace sodium ions</li>
                        <li>Plant salt-tolerant species: ${getSaltTolerantPlants(climate)}</li>
                        <li>Increase irrigation (if water available) to flush salts</li>
                    </ul>
                </div>
            `;
        } else if (salinity > 0.8) {
            recommendationsHTML += `
                <div class="result-section">
                    <h4>Moderate Salinity (${salinity} dS/m)</h4>
                    <p>Your soil has moderate salt levels. Monitor plant health.</p>
                </div>
            `;
        } else {
            recommendationsHTML += `
                <div class="result-section">
                    <h4>Low Salinity (${salinity} dS/m)</h4>
                    <p>Your soil has good salt levels for most plants.</p>
                </div>
            `;
        }
        
        // Topography analysis
        if (topography === 'steep') {
            recommendationsHTML += `
                <div class="result-section">
                    <h4>Steep Slope Management</h4>
                    <p>Your steep topography requires special considerations to prevent erosion.</p>
                    <h5>Recommendations:</h5>
                    <ul>
                        <li>Implement terracing or contour planting</li>
                        <li>Use deep-rooted plants to stabilize soil</li>
                        <li>Consider windbreaks if in windy area</li>
                    </ul>
                </div>
            `;
        }
        
        // Soil texture analysis
        if (soil_type === 'clay') {
            recommendationsHTML += `
                <div class="result-section">
                    <h4>Clay Soil Management</h4>
                    <p>Clay soils have good nutrient holding capacity but poor drainage.</p>
                    <h5>Recommendations:</h5>
                    <ul>
                        <li>Add organic matter (compost, leaf mold) to improve structure</li>
                        <li>Avoid working soil when wet to prevent compaction</li>
                        <li>Consider raised beds for better drainage</li>
                    </ul>
                </div>
            `;
        } else if (soil_type === 'sand') {
            recommendationsHTML += `
                <div class="result-section">
                    <h4>Sandy Soil Management</h4>
                    <p>Sandy soils drain well but have poor nutrient retention.</p>
                    <h5>Recommendations:</h5>
                    <ul>
                        <li>Add organic matter to improve water retention</li>
                        <li>Use slow-release fertilizers</li>
                        <li>Mulch to reduce water evaporation</li>
                    </ul>
                </div>
            `;
        }
        
        // Existing species analysis
        if (existing_species) {
            recommendationsHTML += `
                <div class="result-section">
                    <h4>Plant Compatibility</h4>
                    <p>Based on your existing species (${existing_species}), consider these companion plants:</p>
                    <ul>
                        <li>${getCompanionPlants(existing_species)}</li>
                    </ul>
                </div>
            `;
        }
        
        // Symptom-based recommendations
        if (symptoms.includes('yellowing')) {
            recommendationsHTML += `
                <h3>Yellowing Leaves</h3>
                <p>Yellowing leaves often indicate nutrient deficiencies.</p>
                <h4>Recommendations:</h4>
                <ul>
                    <li>Test for nitrogen, iron, or magnesium deficiencies</li>
                    <li>Apply balanced organic fertilizer</li>
                    <li>Check for overwatering which can cause similar symptoms</li>
                </ul>
            `;
        }
        
        if (symptoms.includes('stunting')) {
            recommendationsHTML += `
                <h3>Stunted Growth</h3>
                <p>Stunted growth can indicate multiple soil issues.</p>
                <h4>Recommendations:</h4>
                <ul>
                    <li>Check for compaction - aerate if needed</li>
                    <li>Test for nutrient deficiencies</li>
                    <li>Ensure proper pH for nutrient availability</li>
                </ul>
            `;
        }
        
        // Set the recommendations content
        resultsContent.innerHTML = recommendationsHTML;
        
        // Generate detailed analysis
        analysisContent.innerHTML = `
            <div class="analysis-section">
                <h4>Site Characteristics</h4>
                <ul>
                    <li><strong>Location:</strong> ${location}</li>
                    <li><strong>Climate:</strong> ${climate}</li>
                    <li><strong>Topography:</strong> ${topography}</li>
                </ul>
            </div>
            <div class="analysis-section">
                <h4>Soil Properties</h4>
                <ul>
                    <li><strong>Texture:</strong> ${soil_type}</li>
                    <li><strong>Salinity:</strong> ${salinity} dS/m (${getEcDescription(salinity)})</li>
                </ul>
            </div>
            <div class="analysis-section">
                <h4>Biological Factors</h4>
                <ul>
                    <li><strong>Existing Species:</strong> ${existing_species || 'Not specified'}</li>
                    <li><strong>Observed Symptoms:</strong> ${symptoms.length > 0 ? symptoms.map(s => getSymptomName(s)).join(', ') : 'None reported'}</li>
                </ul>
            </div>
        `;
        
        // Generate resources
        resourcesContent.innerHTML = `
            <div class="resource-card">
                <h4>Soil Health Improvement Guide</h4>
                <p>Comprehensive guide to improving your soil health through organic methods.</p>
                <a href="#"><i class="fas fa-download"></i> Download PDF</a>
            </div>
            <div class="resource-card">
                <h4>Local Soil Testing Labs</h4>
                <p>Find certified soil testing laboratories in your area for detailed analysis.</p>
                <a href="#"><i class="fas fa-search"></i> Search Labs</a>
            </div>
            <div class="resource-card">
                <h4>Cover Crops Selection Tool</h4>
                <p>Interactive tool to help select the best cover crops for your soil type.</p>
                <a href="#"><i class="fas fa-external-link-alt"></i> Open Tool</a>
            </div>
        `;
        
        // Show expert CTA if expert option was selected
        const resultOption = document.querySelector('input[name="result_option"]:checked').value;
        if (resultOption === 'expert') {
            document.getElementById('expertCTA').style.display = 'block';
        }
    }
    
    // Helper functions for analysis descriptions
    function getEcDescription(ec) {
        if (ec < 0.8) return 'Low salinity';
        if (ec > 1.5) return 'High salinity';
        return 'Moderate salinity';
    }
    
    function getSaltTolerantPlants(climate) {
        const plants = {
            'tropical': 'coconut, date palm, tamarisk',
            'arid': 'agave, saltbush, mesquite',
            'temperate': 'sea buckthorn, rugosa rose, beach plum',
            'mediterranean': 'olive, fig, pomegranate'
        };
        return plants[climate] || 'barley, cotton, sugar beet';
    }
    
    function getCompanionPlants(species) {
        if (species.toLowerCase().includes('corn')) return 'Beans, squash, cucumber, peas, pumpkin';
        if (species.toLowerCase().includes('tomato')) return 'Basil, marigold, onion, parsley, carrot';
        if (species.toLowerCase().includes('potato')) return 'Horseradish, beans, corn, cabbage';
        return 'Marigold, basil, nasturtium, chives (good general companions)';
    }
    
    function getSymptomName(value) {
        const symptoms = {
            'yellowing': 'Yellowing leaves',
            'stunting': 'Stunted growth',
            'wilting': 'Wilting plants',
            'crusting': 'Surface crusting',
            'erosion': 'Erosion signs',
            'discoloration': 'Soil discoloration'
        };
        return symptoms[value] || value;
    }
    
    // New diagnostic button
    document.getElementById('newDiagnostic').addEventListener('click', function() {
        // Reset form and show first step
        document.getElementById('diagnosticForm').reset();
        document.getElementById('photoPreview').innerHTML = '';
        document.getElementById('videoPreview').innerHTML = '';
        document.getElementById('pdfPreview').innerHTML = '';
        document.querySelectorAll('.error-message').forEach(msg => msg.remove());  // Fixed: Clear errors
        
        document.getElementById('diagnosticForm').style.display = 'block';
        document.getElementById('resultsSection').style.display = 'none';
        
        currentStep = 0;
        showStep(currentStep);
        updateProgress();
    });
    
    // Contact expert button
    document.getElementById('contactExpert').addEventListener('click', function() {
        alert('An expert will contact you shortly with personalized advice. Thank you!');
    });
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and content
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
});