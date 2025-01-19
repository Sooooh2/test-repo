// Helper function to show alerts
function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type === 'error' ? 'danger' : 'success'} alert-dismissible fade show`;
    alertDiv.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    document.querySelector('.container').insertBefore(alertDiv, document.querySelector('.container').firstChild);
}

// Handle profile photo
function handleProfilePhoto(data, profilePhotoElement) {
    const defaultPhoto = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
    profilePhotoElement.src = defaultPhoto;
    
    if (data.profilePhoto) {
        const img = new Image();
        img.onload = () => profilePhotoElement.src = data.profilePhoto;
        img.onerror = () => console.log('Failed to load profile photo, using default');
        img.src = data.profilePhoto;
    }
}

// Helper function to create section content
function createSectionContent(data, template, emptyMessage) {
    return data && data.length > 0 
        ? data.map(template).join('')
        : `<p class="text-muted">${emptyMessage}</p>`;
}

// Function to populate resume with data
function populateResume(data) {
    // Profile Photo
    handleProfilePhoto(data, document.getElementById('profilePhoto'));

    // Header Information
    document.getElementById('fullName').textContent = 
        data.userName && data.lastName ? `${data.userName} ${data.lastName}` : (data.userName || 'Name Not Set');
    document.getElementById('email').textContent = data.userEmail || 'Email not provided';
    document.getElementById('phone').textContent = data.userPhone || 'Phone not provided';
    
    // Professional Summary
    document.getElementById('summary').textContent = data.userDescription || 'No professional summary available.';
    
    // Skills
    document.getElementById('skills').innerHTML = createSectionContent(
        data.userSkills?.split(',').map(skill => skill.trim()).filter(Boolean),
        skill => `<span class="skill-item">${skill}</span>`,
        'No skills listed'
    );
    
    // Experience
    document.getElementById('experience').innerHTML = createSectionContent(
        data.experienceContainer,
        exp => `
            <div class="experience-item">
                <h3>${exp.position || 'Position Not Specified'}</h3>
                <h4>${exp.company_name || 'Company Not Specified'}</h4>
                <div class="experience-date">
                    ${exp.start_date || 'Start Date'} - ${exp.end_date || 'Present'}
                </div>
                <ul>
                    ${exp.accomplishments?.split('\n')
                        .map(item => item.trim())
                        .filter(Boolean)
                        .map(item => `<li>${item}</li>`)
                        .join('') || '<li>No accomplishments listed</li>'}
                </ul>
            </div>
        `,
        'No experience listed'
    );
    
    // Education
    document.getElementById('education').innerHTML = createSectionContent(
        data.educationContainer,
        edu => `
            <div class="education-item">
                <h3>${edu.degree || 'Degree Not Specified'}</h3>
                <h4>${edu.institution_name || 'Institution Not Specified'}</h4>
                <div class="education-details">
                    <span>Graduation Year: ${edu.graduation_year || 'Not Specified'}</span>
                    ${edu.grade ? `<span> | Grade: ${edu.grade}</span>` : ''}
                </div>
            </div>
        `,
        'No education listed'
    );
    
    // Projects
    document.getElementById('projects').innerHTML = createSectionContent(
        data.projectsContainer,
        project => `
            <div class="project-item">
                <h3>${project.project_name || 'Project Name Not Specified'}</h3>
                <div class="project-date">
                    ${project.start_date || 'Start Date'} - ${project.end_date || 'End Date'}
                </div>
                <p>${project.description || 'No description available'}</p>
            </div>
        `,
        'No projects listed'
    );
    
    // Social Links
    document.getElementById('socialLinks').innerHTML = createSectionContent(
        data.socialMediaContainer,
        social => `
            <a href="${social.url}" target="_blank" class="social-link">
                <i class="fab fa-${social.platform.toLowerCase()}"></i>
                ${social.platform}
            </a>
        `,
        'No social media links'
    );
}

// Load profile data
async function loadProfileData() {
    try {
        const response = await fetch('http://localhost:3000/api/profile');
        const result = await response.json();
        if (!result.success) throw new Error(result.message || 'Failed to load profile');
        populateResume(result.data);
    } catch (error) {
        console.error('Error loading profile:', error);
        showAlert('error', `Error loading profile: ${error.message}`);
    }
}

// PDF export configuration
const PDF_OPTIONS = {
    margin: 1,
    filename: 'resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
};

// Function to download resume as PDF
function downloadPDF() {
    html2pdf()
        .set(PDF_OPTIONS)
        .from(document.querySelector('.resume-page'))
        .save();
}

// Initialize
document.addEventListener('DOMContentLoaded', loadProfileData);
