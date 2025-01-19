// Helper function to show alerts
function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type === 'error' ? 'danger' : 'success'} alert-dismissible fade show`;
    alertDiv.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    document.querySelector('.container').insertBefore(alertDiv, document.querySelector('.container').firstChild);
}

// Skill icon mapping
const SKILL_ICONS = {
    // Programming Languages
    'javascript': 'fab fa-js',
    'python': 'fab fa-python',
    'java': 'fab fa-java',
    'php': 'fab fa-php',
    'ruby': 'fas fa-gem',
    'c++': 'fas fa-code',
    'c#': 'fas fa-code',
    'swift': 'fab fa-swift',
    'kotlin': 'fas fa-mobile-alt',
    'rust': 'fas fa-cogs',
    
    // Web Technologies
    'html': 'fab fa-html5',
    'css': 'fab fa-css3-alt',
    'react': 'fab fa-react',
    'angular': 'fab fa-angular',
    'vue': 'fab fa-vuejs',
    'node': 'fab fa-node-js',
    'nodejs': 'fab fa-node-js',
    'bootstrap': 'fab fa-bootstrap',
    'sass': 'fab fa-sass',
    'wordpress': 'fab fa-wordpress',
    
    // Databases
    'sql': 'fas fa-database',
    'mysql': 'fas fa-database',
    'mongodb': 'fas fa-database',
    'postgresql': 'fas fa-database',
    'oracle': 'fas fa-database',
    
    // Cloud & DevOps
    'aws': 'fab fa-aws',
    'docker': 'fab fa-docker',
    'kubernetes': 'fas fa-dharmachakra',
    'git': 'fab fa-git-alt',
    'github': 'fab fa-github',
    'gitlab': 'fab fa-gitlab',
    'jenkins': 'fab fa-jenkins',
    
    // Mobile
    'android': 'fab fa-android',
    'ios': 'fab fa-apple',
    'flutter': 'fas fa-mobile-alt',
    'react native': 'fab fa-react',
    
    // AI/ML
    'machine learning': 'fas fa-brain',
    'artificial intelligence': 'fas fa-robot',
    'deep learning': 'fas fa-network-wired',
    'data science': 'fas fa-chart-bar',
    
    // Design
    'photoshop': 'fas fa-paint-brush',
    'illustrator': 'fas fa-pencil-alt',
    'figma': 'fab fa-figma',
    'sketch': 'fas fa-pencil-ruler',
    'ui': 'fas fa-palette',
    'ux': 'fas fa-user',
    
    // Other
    'agile': 'fas fa-sync',
    'scrum': 'fas fa-users',
    'jira': 'fab fa-jira',
    'rest': 'fas fa-server',
    'api': 'fas fa-plug',
    'graphql': 'fas fa-project-diagram'
};

// Helper function to get icon for skill
function getSkillIcon(skill) {
    const skillLower = skill.toLowerCase();
    return SKILL_ICONS[skillLower] || 
           Object.entries(SKILL_ICONS).find(([key]) => skillLower.includes(key))?.[1] || 
           'fas fa-code';
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

// Function to populate profile data
function populateProfile(data) {
    try {
        // Profile Photo
        handleProfilePhoto(data, document.getElementById('profilePhoto'));

        // Basic Info
        document.getElementById('userName').textContent = 
            data.userName && data.lastName ? `${data.userName} ${data.lastName}` : (data.userName || 'Name Not Set');
        document.getElementById('userDescription').textContent = data.userDescription || 'No description available';
        document.getElementById('userEmail').textContent = data.userEmail || 'Email not provided';
        document.getElementById('userPhone').textContent = data.userPhone || 'Phone not provided';

        // Skills
        document.getElementById('skillsContainer').innerHTML = createSectionContent(
            data.userSkills?.split(',').map(skill => skill.trim()).filter(Boolean),
            skill => `
                <span class="skill-badge">
                    <i class="${getSkillIcon(skill)}"></i>
                    ${skill}
                </span>
            `,
            'No skills listed'
        );

        // Experience
        document.getElementById('experienceContainer').innerHTML = createSectionContent(
            data.experienceContainer,
            exp => `
                <div class="experience-item">
                    <h4>${exp.position || 'Position Not Specified'}</h4>
                    <h5>${exp.company_name || 'Company Not Specified'}</h5>
                    <p class="date">${exp.start_date || 'Start Date'} - ${exp.end_date || 'Present'}</p>
                    <p>${exp.accomplishments || 'No accomplishments listed'}</p>
                </div>
            `,
            'No experience listed'
        );

        // Education
        document.getElementById('educationContainer').innerHTML = createSectionContent(
            data.educationContainer,
            edu => `
                <div class="education-item">
                    <h4>${edu.degree || 'Degree Not Specified'}</h4>
                    <h5>${edu.institution_name || 'Institution Not Specified'}</h5>
                    <p>Graduation Year: ${edu.graduation_year || 'Not Specified'}</p>
                    <p>Grade: ${edu.grade || 'Not Specified'}</p>
                </div>
            `,
            'No education listed'
        );

        // Projects
        document.getElementById('projectsContainer').innerHTML = createSectionContent(
            data.projectsContainer,
            project => `
                <div class="project-item">
                    <h4>${project.project_name || 'Project Name Not Specified'}</h4>
                    <p class="date">${project.start_date || 'Start Date'} - ${project.end_date || 'End Date'}</p>
                    <p>${project.description || 'No description available'}</p>
                </div>
            `,
            'No projects listed'
        );

        // Social Media Links
        document.getElementById('socialMediaContainer').innerHTML = createSectionContent(
            data.socialMediaContainer,
            social => `
                <a href="${social.url}" target="_blank" class="social-link" title="${social.platform}">
                    <i class="fab fa-${social.platform.toLowerCase()}"></i>
                </a>
            `,
            'No social media links'
        );

    } catch (error) {
        console.error('Error populating profile:', error);
        showAlert('error', 'Error displaying profile data');
    }
}

// Load profile data
async function loadProfileData() {
    try {
        const response = await fetch('http://localhost:3000/api/profile');
        const result = await response.json();
        if (!result.success) throw new Error(result.message || 'Failed to load profile');
        populateProfile(result.data);
    } catch (error) {
        console.error('Error loading profile:', error);
        showAlert('error', `Error loading profile: ${error.message}`);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', loadProfileData);
