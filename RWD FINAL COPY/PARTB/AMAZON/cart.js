// Cart page functionality

function initCart() {
    checkAuthStatus();
    displayCart();
    setupEventListeners();
}

// Display cart items
function displayCart() {
    const cart = Cart.get();
    const cartContent = document.getElementById('cartContent');
    const emptyCart = document.getElementById('emptyCart');
    const cartSummary = document.getElementById('cartSummary');
    
    if (cart.length === 0) {
        if (cartContent) cartContent.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }
    
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'block';
    
    if (cartContent) {
        cartContent.innerHTML = cart.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-description">${item.description}</p>
                    <div class="cart-item-price">₹${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-product-id="${item.id}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn increase" data-product-id="${item.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="cart-item-total">
                    <span class="item-total-price">₹${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <button class="remove-item-btn" data-product-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
    
    updateCartSummary();
    attachCartListeners();
}

// Attach event listeners to cart items
function attachCartListeners() {
    // Remove item buttons
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(btn.dataset.productId);
            removeItem(productId);
        });
    });
    
    // Increase quantity buttons
    document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(btn.dataset.productId);
            updateQuantity(productId, 1);
        });
    });
    
    // Decrease quantity buttons
    document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(btn.dataset.productId);
            const cart = Cart.get();
            const item = cart.find(i => i.id === productId);
            if (item) {
                updateQuantity(productId, -1);
            }
        });
    });
}

// Remove item from cart
function removeItem(productId) {
    const cart = Cart.get();
    const item = cart.find(i => i.id === productId);
    
    if (item && confirm(`Remove ${item.name} from cart?`)) {
        Cart.remove(productId);
        Alert.success('Item removed from cart');
        displayCart();
    }
}

// Update quantity
function updateQuantity(productId, change) {
    const cart = Cart.get();
    const item = cart.find(i => i.id === productId);
    
    if (item) {
        const newQuantity = item.quantity + change;
        Cart.updateQuantity(productId, newQuantity);
        displayCart();
        
        if (change > 0) {
            Alert.success('Quantity increased');
        } else if (newQuantity > 0) {
            Alert.info('Quantity decreased');
        }
    }
}

// Update cart summary
function updateCartSummary() {
    const subtotal = Cart.getTotal();
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `₹${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `₹${total.toFixed(2)}`;
}

// Setup event listeners
function setupEventListeners() {
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (!User.isLoggedIn()) {
                Alert.error('Please login to checkout');
                setTimeout(() => {
                    window.location.href = 'login.html?redirect=cart.html';
                }, 1500);
                return;
            }
            
            if (confirm('Proceed to checkout?')) {
                Alert.success('Order placed successfully!');
                Cart.clear();
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }
        });
    }
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', Theme.toggle);
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCart);
} else {
    initCart();
}

