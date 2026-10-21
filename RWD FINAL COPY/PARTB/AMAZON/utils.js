// Utility functions for localStorage, alerts, and validation

// LocalStorage helpers
const Storage = {
    get: (key) => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    },
    
    set: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    },
    
    remove: (key) => {
        localStorage.removeItem(key);
    },
    
    clear: () => {
        localStorage.clear();
    }
};

// Cart management
const Cart = {
    get: () => {
        return Storage.get('cart') || [];
    },
    
    add: (product, quantity = 1) => {
        const cart = Cart.get();
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ ...product, quantity });
        }
        
        Storage.set('cart', cart);
        Cart.updateCount();
        return cart;
    },
    
    remove: (productId) => {
        const cart = Cart.get();
        const filteredCart = cart.filter(item => item.id !== productId);
        Storage.set('cart', filteredCart);
        Cart.updateCount();
        return filteredCart;
    },
    
    updateQuantity: (productId, quantity) => {
        const cart = Cart.get();
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            if (quantity <= 0) {
                return Cart.remove(productId);
            }
            item.quantity = quantity;
        }
        
        Storage.set('cart', cart);
        Cart.updateCount();
        return cart;
    },
    
    clear: () => {
        Storage.remove('cart');
        Cart.updateCount();
    },
    
    getTotal: () => {
        const cart = Cart.get();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    getCount: () => {
        const cart = Cart.get();
        return cart.reduce((count, item) => count + item.quantity, 0);
    },
    
    updateCount: () => {
        const count = Cart.getCount();
        const cartCountElements = document.querySelectorAll('#cartCount');
        cartCountElements.forEach(el => {
            if (el) el.textContent = count;
        });
    }
};

// User management
const User = {
    get: () => {
        return Storage.get('currentUser');
    },
    
    set: (user) => {
        Storage.set('currentUser', user);
    },
    
    logout: () => {
        Storage.remove('currentUser');
    },
    
    isLoggedIn: () => {
        return User.get() !== null;
    }
};

// Alert system
const Alert = {
    show: (message, type = 'success') => {
        const alertContainer = document.getElementById('alertContainer');
        if (!alertContainer) return;
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <span>${message}</span>
            <button class="alert-close">&times;</button>
        `;
        
        alertContainer.appendChild(alert);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            alert.classList.add('fade-out');
            setTimeout(() => alert.remove(), 300);
        }, 3000);
        
        // Close button
        alert.querySelector('.alert-close').addEventListener('click', () => {
            alert.classList.add('fade-out');
            setTimeout(() => alert.remove(), 300);
        });
    },
    
    success: (message) => Alert.show(message, 'success'),
    error: (message) => Alert.show(message, 'error'),
    info: (message) => Alert.show(message, 'info')
};

// Form validation
const Validation = {
    isEmpty: (value) => {
        return !value || value.trim() === '';
    },
    
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    isValidPassword: (password) => {
        return password && password.length >= 6;
    },
    
    passwordsMatch: (password, confirmPassword) => {
        return password === confirmPassword;
    }
};

// Theme management
const Theme = {
    init: () => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.classList.toggle('dark-mode', savedTheme === 'dark');
        Theme.updateToggleIcon();
    },
    
    toggle: () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        Theme.updateToggleIcon();
    },
    
    updateToggleIcon: () => {
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.className = document.body.classList.contains('dark-mode') 
                    ? 'fas fa-sun' 
                    : 'fas fa-moon';
            }
        }
    }
};

// Loader
const Loader = {
    show: () => {
        const loader = document.getElementById('loader');
        if (loader) loader.style.display = 'flex';
    },
    
    hide: () => {
        const loader = document.getElementById('loader');
        if (loader) loader.style.display = 'none';
    }
};

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        Cart.updateCount();
        Theme.init();
    });
} else {
    Cart.updateCount();
    Theme.init();
}

