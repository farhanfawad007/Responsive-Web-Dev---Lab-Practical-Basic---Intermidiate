// Authentication Module
class AuthManager {
    constructor() {
        // Hardcoded credentials
        this.credentials = {
            email: 'farhanfawad007@gmail.com',
            password: '1234567'
        };
        this.init();
    }

    init() {
        // Check if user is logged in on page load
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            this.checkAuth();
            this.updateAuthButtons();
        }

        // Setup login form if exists
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Setup logout button if exists
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Setup sign in button if exists
        const signInBtn = document.getElementById('signInBtn');
        if (signInBtn) {
            signInBtn.addEventListener('click', () => {
                window.location.href = 'login.html';
            });
        }
    }

    updateAuthButtons() {
        const isLoggedIn = this.isAuthenticated();
        const signInBtn = document.getElementById('signInBtn');
        const logoutBtn = document.getElementById('logoutBtn');

        if (signInBtn) {
            signInBtn.style.display = isLoggedIn ? 'none' : 'block';
        }
        if (logoutBtn) {
            logoutBtn.style.display = isLoggedIn ? 'block' : 'none';
        }
    }

    checkAuth() {
        const isLoggedIn = localStorage.getItem('netflix_user_logged_in');
        if (!isLoggedIn || isLoggedIn !== 'true') {
            // Redirect to login if not authenticated
            window.location.href = 'login.html';
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('errorMessage');

        // Client-side validation
        if (!this.validateEmail(email)) {
            this.showError('Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            this.showError('Password must be at least 6 characters');
            return;
        }

        // Check credentials
        if (email === this.credentials.email && password === this.credentials.password) {
            // Store login session
            localStorage.setItem('netflix_user_logged_in', 'true');
            localStorage.setItem('netflix_user_email', email);
            
            // Update buttons before redirect
            this.updateAuthButtons();
            
            // Redirect to home page
            window.location.href = 'index.html';
        } else {
            this.showError('Invalid email or password. Try: farhanfawad007@gmail.com / 1234567');
        }
    }

    handleLogout() {
        // Clear session
        localStorage.removeItem('netflix_user_logged_in');
        localStorage.removeItem('netflix_user_email');
        localStorage.removeItem('netflix_watchlist');
        localStorage.removeItem('netflix_ratings');
        
        // Redirect to login
        window.location.href = 'login.html';
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    showError(message) {
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.classList.add('show');
            
            // Hide error after 5 seconds
            setTimeout(() => {
                errorMessage.classList.remove('show');
            }, 5000);
        }
    }

    isAuthenticated() {
        return localStorage.getItem('netflix_user_logged_in') === 'true';
    }
}

// Initialize auth manager
const authManager = new AuthManager();

