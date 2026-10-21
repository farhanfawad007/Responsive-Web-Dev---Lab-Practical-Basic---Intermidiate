// Theme Management
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

// Theme toggle functionality
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    if (themeToggle) {
        themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

// Login Authentication
const loginModal = document.getElementById('loginModal');
const loginLink = document.getElementById('loginLink');
const loginForm = document.getElementById('loginForm');
const closeModal = document.querySelector('.close');
const loginError = document.getElementById('loginError');

// Demo credentials
const DEMO_EMAIL = 'farhanfawad007@gmail.com';
const DEMO_PASSWORD = '1234567';

// Open modal when login link is clicked
if (loginLink) {
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (loginModal) {
            loginModal.style.display = 'block';
        }
    });
}

// Close modal when X is clicked
if (closeModal) {
    closeModal.addEventListener('click', () => {
        if (loginModal) {
            loginModal.style.display = 'none';
            if (loginError) loginError.textContent = '';
            if (loginForm) loginForm.reset();
        }
    });
}

// Close modal when clicking outside of it
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
        if (loginError) loginError.textContent = '';
        if (loginForm) loginForm.reset();
    }
});

// Handle login form submission
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        // Clear previous error
        if (loginError) {
            loginError.textContent = '';
        }
        
        // Validate credentials
        if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
            // Successful login
            alert('Login successful! Welcome back!');
            loginModal.style.display = 'none';
            loginForm.reset();
            
            // Update login link to show logged in state
            if (loginLink) {
                loginLink.textContent = 'Logout';
                loginLink.href = '#';
                loginLink.onclick = (e) => {
                    e.preventDefault();
                    if (confirm('Are you sure you want to logout?')) {
                        loginLink.textContent = 'Login';
                        loginLink.onclick = null;
                    }
                };
            }
            
            // Store login state
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
        } else {
            // Invalid credentials
            if (loginError) {
                loginError.textContent = 'Invalid email or password. Please try again.';
            }
        }
    });
}

// Check if user is already logged in on page load
window.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true' && loginLink) {
        loginLink.textContent = 'Logout';
        loginLink.href = '#';
        loginLink.onclick = (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userEmail');
                loginLink.textContent = 'Login';
                loginLink.onclick = null;
            }
        };
    }
});
