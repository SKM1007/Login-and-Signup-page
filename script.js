// Utility functions
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

// Show/Hide Section Function
function showSection(sectionId) {
    $$('.form-section').forEach(section => {
        section.classList.remove('active');
    });
    $(`#${sectionId}`).classList.add('active');
}

// Event Listeners
$('#showRegisterForm').addEventListener('click', e => {
    e.preventDefault();
    showSection('register');
});

$('#backToLoginFromRegister').addEventListener('click', e => {
    e.preventDefault();
    showSection('login');
});

$('#forgotPasswordLink').addEventListener('click', e => {
    e.preventDefault();
    showSection('resetPassword');
});

$('#backToLogin').addEventListener('click', e => {
    e.preventDefault();
    showSection('login');
});

// Form Submissions
$('#loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const username = $('#loginUsername').value;
    const password = $('#loginPassword').value;

    try {
        const userInfo = JSON.parse(localStorage.getItem(username));
        if (userInfo && userInfo.password === password) {
            showSection('profile');
            $('#profileUsername').textContent = username;
            $('#profileEmail').textContent = userInfo.email;
            $('#profileBio').textContent = userInfo.bio || 'No bio added yet';
            $('#profilePicture').src = userInfo.profilePicture || 'default-avatar.jpg';
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        alert('Invalid username or password.');
    }
});

$('#registerForm').addEventListener('submit', e => {
    e.preventDefault();
    const username = $('#registerUsername').value;
    const email = $('#registerEmail').value;
    const password = $('#registerPassword').value;

    if (!localStorage.getItem(username)) {
        const userInfo = { email, password, bio: '', profilePicture: '' };
        localStorage.setItem(username, JSON.stringify(userInfo));
        alert('Registration successful. Please login.');
        showSection('login');
        $('#registerForm').reset();
    } else {
        alert('Username already exists.');
    }
});

// Profile Management
$('#editProfileBtn').addEventListener('click', () => {
    $('#editProfileForm').classList.toggle('hidden');
});

$('#saveProfileChanges').addEventListener('click', () => {
    const username = $('#profileUsername').textContent;
    const userInfo = JSON.parse(localStorage.getItem(username));
    
    const newEmail = $('#editEmail').value;
    const newBio = $('#editBio').value;

    if (newEmail) userInfo.email = newEmail;
    if (newBio) userInfo.bio = newBio;

    localStorage.setItem(username, JSON.stringify(userInfo));
    
    $('#profileEmail').textContent = userInfo.email;
    $('#profileBio').textContent = userInfo.bio;
    $('#editProfileForm').classList.add('hidden');
    $('#editEmail').value = '';
    $('#editBio').value = '';

    alert('Profile updated successfully!');
});

$('#logoutButton').addEventListener('click', () => {
    showSection('login');
    $('#loginForm').reset();
});

// Profile Picture Management
$('#changePictureBtn').addEventListener('click', () => {
    $('#profilePictureInput').click();
});

$('#profilePictureInput').addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const username = $('#profileUsername').textContent;
            const userInfo = JSON.parse(localStorage.getItem(username));
            userInfo.profilePicture = e.target.result;
            localStorage.setItem(username, JSON.stringify(userInfo));
            $('#profilePicture').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});
