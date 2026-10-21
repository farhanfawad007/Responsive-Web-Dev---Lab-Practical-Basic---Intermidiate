// Authentication system
const DEMO_EMAIL = 'farhanfawad007@gmail.com';
const DEMO_PASSWORD = '1234567';

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Login function
function login(email, password) {
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        updateNavBar();
        return true;
    }
    return false;
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    updateNavBar();
}

// Update navigation bar based on login status
function updateNavBar() {
    const loginBtn = document.getElementById('loginBtn');
    const userInfo = document.getElementById('userInfo');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (isLoggedIn()) {
        const email = localStorage.getItem('userEmail');
        if (loginBtn) loginBtn.style.display = 'none';
        if (userInfo) {
            userInfo.style.display = 'block';
            userInfo.textContent = email.split('@')[0];
        }
        if (logoutBtn) logoutBtn.style.display = 'block';
    } else {
        if (loginBtn) loginBtn.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (login(email, password)) {
        closeLoginModal();
        alert('Login successful! Welcome back!');
    } else {
        alert('Invalid email or password. Please try again.');
    }
}

// Open login modal
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Close login modal
function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
        // Reset form
        const form = document.getElementById('loginForm');
        if (form) form.reset();
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
        closeLoginModal();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateNavBar();
});
