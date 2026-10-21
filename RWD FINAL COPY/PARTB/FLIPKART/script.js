// Authentication credentials
const AUTH_EMAIL = 'farhanfawad007@gmail.com';
const AUTH_PASSWORD = '1234567';

// Check if user is logged in
let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
let currentUser = localStorage.getItem('currentUser') || '';

// Cart management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Product data
const products = [
    {
        id: 1,
        name: 'Samsung Galaxy S23 Ultra',
        price: 89999,
        originalPrice: 119999,
        rating: 4.5,
        emoji: '📱'
    },
    {
        id: 2,
        name: 'Apple MacBook Pro 14"',
        price: 189999,
        originalPrice: 219999,
        rating: 4.8,
        emoji: '💻'
    },
    {
        id: 3,
        name: 'Sony WH-1000XM5 Headphones',
        price: 24999,
        originalPrice: 29999,
        rating: 4.7,
        emoji: '🎧'
    },
    {
        id: 4,
        name: 'Nike Air Max 270',
        price: 8999,
        originalPrice: 11999,
        rating: 4.4,
        emoji: '👟'
    },
    {
        id: 5,
        name: 'Canon EOS R6 Camera',
        price: 199999,
        originalPrice: 249999,
        rating: 4.9,
        emoji: '📷'
    },
    {
        id: 6,
        name: 'Samsung 55" QLED TV',
        price: 89999,
        originalPrice: 129999,
        rating: 4.6,
        emoji: '📺'
    },
    {
        id: 7,
        name: 'Dyson V15 Vacuum Cleaner',
        price: 49999,
        originalPrice: 59999,
        rating: 4.5,
        emoji: '🧹'
    },
    {
        id: 8,
        name: 'Fitbit Charge 6',
        price: 12999,
        originalPrice: 15999,
        rating: 4.3,
        emoji: '⌚'
    },
    {
        id: 9,
        name: 'iPad Pro 12.9"',
        price: 99999,
        originalPrice: 119999,
        rating: 4.7,
        emoji: '📱'
    },
    {
        id: 10,
        name: 'Bose SoundLink Speaker',
        price: 14999,
        originalPrice: 19999,
        rating: 4.4,
        emoji: '🔊'
    },
    {
        id: 11,
        name: 'LG Refrigerator 300L',
        price: 34999,
        originalPrice: 42999,
        rating: 4.2,
        emoji: '❄️'
    },
    {
        id: 12,
        name: 'Xbox Series X Console',
        price: 49999,
        originalPrice: 54999,
        rating: 4.6,
        emoji: '🎮'
    }
];

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const closeModal = document.getElementById('closeModal');
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const userInfo = document.getElementById('userInfo');
const userEmail = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');
const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCartModal = document.getElementById('closeCartModal');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartSummary = document.getElementById('cartSummary');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    renderProducts();
    updateCartCount();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    loginBtn.addEventListener('click', openLoginModal);
    closeModal.addEventListener('click', closeLoginModal);
    logoutBtn.addEventListener('click', handleLogout);
    cartBtn.addEventListener('click', openCartModal);
    closeCartModal.addEventListener('click', closeCartModalFunc);
    checkoutBtn.addEventListener('click', handleCheckout);
    
    loginForm.addEventListener('submit', handleLogin);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            closeLoginModal();
        }
        if (e.target === cartModal) {
            closeCartModalFunc();
        }
    });
}

// Check authentication status
function checkAuthStatus() {
    if (isLoggedIn && currentUser) {
        showUserInfo();
        loginBtn.textContent = currentUser.split('@')[0];
    } else {
        hideUserInfo();
        loginBtn.textContent = 'Login';
    }
}

// Show user info bar
function showUserInfo() {
    userInfo.style.display = 'block';
    userEmail.textContent = currentUser;
}

// Hide user info bar
function hideUserInfo() {
    userInfo.style.display = 'none';
}

// Open login modal
function openLoginModal() {
    if (isLoggedIn) {
        handleLogout();
        return;
    }
    loginModal.classList.add('show');
    errorMessage.classList.remove('show');
    loginForm.reset();
}

// Close login modal
function closeLoginModal() {
    loginModal.classList.remove('show');
    errorMessage.classList.remove('show');
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    if (email === AUTH_EMAIL && password === AUTH_PASSWORD) {
        // Successful login
        isLoggedIn = true;
        currentUser = email;
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', email);
        
        closeLoginModal();
        checkAuthStatus();
        showSuccessMessage('Login successful!');
    } else {
        // Failed login
        errorMessage.textContent = 'Invalid email or password. Please try again.';
        errorMessage.classList.add('show');
    }
}

// Handle logout
function handleLogout() {
    isLoggedIn = false;
    currentUser = '';
    cart = [];
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cart');
    
    updateCartCount();
    checkAuthStatus();
    showSuccessMessage('Logged out successfully!');
}

// Show success message
function showSuccessMessage(message) {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #26a541;
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Render products
function renderProducts() {
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-title">${product.name}</div>
            <div class="product-rating">
                <span class="rating-stars">${stars}</span>
                <span>(${product.rating})</span>
            </div>
            <div class="product-price">
                <span class="price-current">₹${product.price.toLocaleString('en-IN')}</span>
                <span class="price-original">₹${product.originalPrice.toLocaleString('en-IN')}</span>
                <span class="price-discount">${discount}% off</span>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        
        productsGrid.appendChild(productCard);
    });
}

// Add to cart function
function addToCart(productId) {
    if (!isLoggedIn) {
        openLoginModal();
        showSuccessMessage('Please login to add items to cart');
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (product) {
        // Check if product already exists in cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        saveCart();
        updateCartCount();
        showSuccessMessage(`${product.name} added to cart!`);
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();
    showSuccessMessage('Item removed from cart');
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        saveCart();
        updateCartCount();
        renderCart();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart count badge
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    if (totalItems > 0) {
        cartCount.style.display = 'inline-block';
    } else {
        cartCount.style.display = 'none';
    }
}

// Open cart modal
function openCartModal() {
    if (!isLoggedIn) {
        openLoginModal();
        showSuccessMessage('Please login to view your cart');
        return;
    }
    renderCart();
    cartModal.classList.add('show');
}

// Close cart modal
function closeCartModalFunc() {
    cartModal.classList.remove('show');
}

// Render cart items
function renderCart() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartSummary.style.display = 'none';
        return;
    }
    
    cartEmpty.style.display = 'none';
    cartSummary.style.display = 'block';
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">${item.emoji}</div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <div class="cart-item-total">₹${itemTotal.toLocaleString('en-IN')}</div>
            <button class="remove-item-btn" onclick="removeFromCart(${item.id})">×</button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toLocaleString('en-IN');
}

// Handle checkout
function handleCheckout() {
    if (cart.length === 0) {
        showSuccessMessage('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    showSuccessMessage(`Order placed successfully! Total: ₹${total.toLocaleString('en-IN')}`);
    
    // Clear cart after checkout
    cart = [];
    saveCart();
    updateCartCount();
    renderCart();
    closeCartModalFunc();
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
