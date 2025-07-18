let pledges = [
    {
        id: 'PLG001',
        name: 'Harsh',
        date: '2025-07-17',
        state: 'Karnataka',
        profileType: 'Student',
        commitments: ['Use renewable energy', 'Reduce plastic use', 'Plant trees']
    },
    {
        id: 'PLG002',
        name: 'Prathik',
        date: '2025-07-18',
        state: 'Karnataka',
        profileType: 'Working Professional',
        commitments: ['Use public transport', 'Buy local products']
    },
    {
        id: 'PLG003',
        name: 'Sudeep',
        date: '2025-07-18',
        state: 'Karnataka',
        profileType: 'Student',
        commitments: ['Reduce energy use', 'Zero waste lifestyle', 'Spread awareness', 'Conserve water']
    }
];

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateKPIs();
    loadPledgesTable();
    initializeEventListeners();
});


//Update Key Performance Indicators (KPIs) in impact section
function updateKPIs() {
    const total = pledges.length;
    const students = pledges.filter(p => p.profileType === 'Student').length;
    const professionals = pledges.filter(p => p.profileType === 'Working Professional').length;

    // Update impact section numbers
    const impactBoxes = document.querySelectorAll('.impact-box h2');
    if (impactBoxes.length >= 4) {
        impactBoxes[1].textContent = total; 
        impactBoxes[2].textContent = students;
        impactBoxes[3].textContent = professionals; 
    }
}

//Load pledges data into the table
function loadPledgesTable() {
    const tableBody = document.getElementById('pledgesTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    pledges.forEach(pledge => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td class="pledges-id">${pledge.id}</td>
            <td class="pledges-name">${pledge.name}</td>
            <td>${pledge.state}</td>
            <td>${pledge.profileType}</td>
            <td>${new Date(pledge.date).toLocaleDateString()}</td>
            <td class="pledges-commitments">${pledge.commitments.join(', ')}</td>
        `;
    });
}

//Generate unique pledge ID
function generateId() {
    return 'PLG' + String(pledges.length + 1).padStart(3, '0');
}

//Initialize all event listeners
function initializeEventListeners() {
    // Form submission handler
    const pledgeForm = document.getElementById('pledgeForm');

    if (pledgeForm) {
        pledgeForm.addEventListener('submit', handleFormSubmission);
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

//Handle form submission
function handleFormSubmission(e) {
    e.preventDefault();
    
    // Get form data
    const formData = getFormData();
    
    // Validate form data
    if (!validateFormData(formData)) {
        return;
    }

    // Create new pledge object
    const newPledge = {
        id: generateId(),
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        state: formData.state,
        profileType: formData.profileType,
        commitments: formData.commitments,
        date: new Date().toISOString().split('T')[0]
    };

    // Add pledge to array and update UI
    pledges.push(newPledge);
    updateKPIs();
    loadPledgesTable();
    showCertificate(newPledge);
    
    // Reset form and show success message
    e.target.reset();
    alert('Pledge submitted successfully!');
}

//Get form data from all form fields
function getFormData() {
    return {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        mobile: document.getElementById('mobile').value,
        state: document.getElementById('state').value,
        profileType: document.querySelector('input[name="profileType"]:checked')?.value,
        commitments: getAllCommitments()
    };
}

//Get all selected commitments from all categories
function getAllCommitments() {
    const energyCommitments = Array.from(document.querySelectorAll('input[name="energy"]:checked')).map(cb => cb.value);
    const sustainableCommitments = Array.from(document.querySelectorAll('input[name="sustainable"]:checked')).map(cb => cb.value);
    const conservationCommitments = Array.from(document.querySelectorAll('input[name="conservation"]:checked')).map(cb => cb.value);
    
    return [...energyCommitments, ...sustainableCommitments, ...conservationCommitments];
}

//Validate form data
function validateFormData(formData) {
    if (!formData.profileType) {
        alert('Please select a profile type!');
        return false;
    }
    
    if (formData.commitments.length === 0) {
        alert('Please select at least one commitment!');
        return false;
    }
    
    return true;
}

//Show certificate for the pledge
function showCertificate(pledge) {
    const certificateNameElement = document.getElementById('certificateName');
    const certificateDateElement = document.getElementById('certificateDate');
    const certificateStarsElement = document.getElementById('certificateStars');
    const certificateSection = document.getElementById('certificate');
    
    if (certificateNameElement && certificateDateElement && certificateStarsElement && certificateSection) {
        // Update certificate content
        certificateNameElement.textContent = pledge.name;
        certificateDateElement.textContent = new Date().toLocaleDateString();
        
        // Generate stars based on commitment count
        const stars = '⭐'.repeat(Math.min(pledge.commitments.length, 5));
        certificateStarsElement.textContent = stars;
        
        // Show certificate and scroll to it
        certificateSection.style.display = 'block';
        certificateSection.scrollIntoView({ behavior: 'smooth' });
    }
}

//Print certificate functionality
function printCertificate() {
    // Hide all sections except certificate
    const allSections = document.querySelectorAll('body > *:not(#certificate)');
    allSections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show only certificate section
    const certificateSection = document.getElementById('certificate');
    if (certificateSection) {
        certificateSection.style.display = 'block';
    }
    
    // Print the page
    window.print();
    
    // Restore all sections after printing
    setTimeout(() => {
        allSections.forEach(section => {
            section.style.display = '';
        });
    }, 1000);
}

window.printCertificate = printCertificate;
