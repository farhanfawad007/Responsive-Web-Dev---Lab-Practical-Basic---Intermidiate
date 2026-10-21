// Authentication functionality

// Check if user is logged in and update UI
function checkAuthStatus() {
    const user = User.get();
    const userInfoTop = document.getElementById('userInfoTop');
    const userInfoBottom = document.querySelectorAll('.user-info-bottom');
    const logoutBtn = document.getElementById('logoutBtn');
    const userInfo = document.getElementById('userInfo');
    
    if (user) {
        if (userInfoTop) {
            userInfoTop.innerHTML = `<span class="user-greeting">Hello, ${user.name}</span>`;
        }
        userInfoBottom.forEach(el => {
            if (el) {
                const span = el.querySelector('span');
                if (span) span.textContent = 'Account & Lists';
            }
        });
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (userInfo) {
            userInfo.style.cursor = 'pointer';
        }
    } else {
        if (userInfoTop) {
            userInfoTop.innerHTML = '<span class="user-greeting">Hello, sign in</span>';
        }
        userInfoBottom.forEach(el => {
            if (el) {
                const span = el.querySelector('span');
                if (span) span.textContent = 'Account & Lists';
            }
        });
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (userInfo) {
            userInfo.style.cursor = 'pointer';
        }
    }
    
    // Initialize click handler after updating status
    initUserInfoClick();
}

// Sign Up functionality
function initSignup() {
    const signupForm = document.getElementById('signupForm');
    if (!signupForm) return;
    
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Clear previous errors
        clearErrors();
        
        let hasError = false;
        
        // Validate name
        if (Validation.isEmpty(name)) {
            showError('nameError', 'Name is required');
            hasError = true;
        }
        
        // Validate email
        if (Validation.isEmpty(email)) {
            showError('signupEmailError', 'Email is required');
            hasError = true;
        } else if (!Validation.isValidEmail(email)) {
            showError('signupEmailError', 'Please enter a valid email');
            hasError = true;
        }
        
        // Validate password
        if (Validation.isEmpty(password)) {
            showError('signupPasswordError', 'Password is required');
            hasError = true;
        } else if (!Validation.isValidPassword(password)) {
            showError('signupPasswordError', 'Password must be at least 6 characters');
            hasError = true;
        }
        
        // Validate confirm password
        if (Validation.isEmpty(confirmPassword)) {
            showError('confirmPasswordError', 'Please confirm your password');
            hasError = true;
        } else if (!Validation.passwordsMatch(password, confirmPassword)) {
            showError('confirmPasswordError', 'Passwords do not match');
            hasError = true;
        }
        
        if (hasError) {
            Alert.error('Please fix the errors above');
            return;
        }
        
        // Check if user already exists
        const users = Storage.get('users') || [];
        const existingUser = users.find(u => u.email === email);
        
        if (existingUser) {
            Alert.error('User with this email already exists');
            showError('signupEmailError', 'Email already registered');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now(),
            name,
            email,
            password // In real app, this should be hashed
        };
        
        users.push(newUser);
        Storage.set('users', users);
        
        // Auto login
        User.set(newUser);
        Alert.success('Account created successfully!');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    });
}

// Login functionality
function initLogin() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        // Clear previous errors
        clearErrors();
        
        let hasError = false;
        
        // Validate email
        if (Validation.isEmpty(email)) {
            showError('emailError', 'Email is required');
            hasError = true;
        } else if (!Validation.isValidEmail(email)) {
            showError('emailError', 'Please enter a valid email');
            hasError = true;
        }
        
        // Validate password
        if (Validation.isEmpty(password)) {
            showError('passwordError', 'Password is required');
            hasError = true;
        }
        
        if (hasError) {
            Alert.error('Please fix the errors above');
            return;
        }
        
        // Check credentials
        const users = Storage.get('users') || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            Alert.error('Invalid email or password');
            showError('emailError', 'Invalid credentials');
            showError('passwordError', 'Invalid credentials');
            return;
        }
        
        // Login successful
        User.set({ id: user.id, name: user.name, email: user.email });
        Alert.success('Login successful!');
        
        setTimeout(() => {
            const redirectTo = new URLSearchParams(window.location.search).get('redirect') || 'index.html';
            window.location.href = redirectTo;
        }, 1500);
    });
}

// Logout functionality
function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                User.logout();
                Alert.success('Logged out successfully');
                checkAuthStatus();
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }
        });
    }
}

// Helper functions
function showError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => el.textContent = '');
}

// Redirect if not logged in (for protected pages)
function requireAuth() {
    if (!User.isLoggedIn()) {
        Alert.info('Please login to continue');
        setTimeout(() => {
            window.location.href = `login.html?redirect=${encodeURIComponent(window.location.pathname)}`;
        }, 1500);
        return false;
    }
    return true;
}

// Initialize demo user (for testing purposes)
function initDemoUser() {
    const users = Storage.get('users') || [];
    
    // Check if demo user already exists
    const demoUserExists = users.find(u => u.email === 'farhanfawad007@gmail.com');
    
    if (!demoUserExists) {
        // Create demo user
        const demoUser = {
            id: 1,
            name: 'Farhan Fawad',
            email: 'farhanfawad007@gmail.com',
            password: '1234567'
        };
        
        users.push(demoUser);
        Storage.set('users', users);
    }
}

// Initialize user info click handler
function initUserInfoClick() {
    const userInfo = document.getElementById('userInfo');
    if (userInfo) {
        // Remove any existing handlers
        userInfo.onclick = null;
        
        // Check if user is logged in
        const user = User.get();
        if (!user) {
            // Not logged in - redirect to login
            userInfo.onclick = function() {
                window.location.href = 'login.html';
            };
        } else {
            // Logged in - could show account menu or do nothing
            userInfo.onclick = null;
        }
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initDemoUser();
        checkAuthStatus();
        initUserInfoClick();
        initSignup();
        initLogin();
        initLogout();
    });
} else {
    initDemoUser();
    checkAuthStatus();
    initUserInfoClick();
    initSignup();
    initLogin();
    initLogout();
}

