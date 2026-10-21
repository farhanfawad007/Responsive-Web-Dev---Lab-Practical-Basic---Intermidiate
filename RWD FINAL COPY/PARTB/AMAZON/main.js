// Main page functionality (index.html)

let filteredProducts = [...products];
let wishlist = Storage.get('wishlist') || [];

// Initialize page
function init() {
    displayProducts(products);
    setupEventListeners();
    checkAuthStatus();
    updateWishlistButtons();
}

// Display products
function displayProducts(productsToShow) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    if (productsToShow.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">No products found</p>';
        return;
    }
    
    productsGrid.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image-container">
                <img src="${product.image}" 
                     alt="${product.name}" 
                     class="product-image"
                     data-hover="${product.imageHover || product.image}"
                     data-normal="${product.image}">
                <button class="wishlist-btn" data-product-id="${product.id}">
                    <i class="fas fa-heart ${isInWishlist(product.id) ? 'active' : ''}"></i>
                </button>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">₹${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="btn-add-cart" data-product-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn-buy-now" data-product-id="${product.id}">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Attach event listeners to new products
    attachProductListeners();
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', handleFilter);
    }
    
    // Sort filter
    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) {
        sortFilter.addEventListener('change', handleFilter);
    }
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', Theme.toggle);
    }
    
    // Back to top button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.style.display = 'block';
            } else {
                backToTop.style.display = 'none';
            }
        });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }
}

// Attach listeners to product cards
function attachProductListeners() {
    // Add to cart buttons
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(btn.dataset.productId);
            addToCart(productId);
        });
    });
    
    // Buy now buttons
    document.querySelectorAll('.btn-buy-now').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(btn.dataset.productId);
            buyNow(productId);
        });
    });
    
    // Wishlist buttons
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.productId);
            toggleWishlist(productId);
        });
    });
    
    // Image hover effect
    document.querySelectorAll('.product-image').forEach(img => {
        const hoverSrc = img.dataset.hover;
        const normalSrc = img.dataset.normal;
        
        img.addEventListener('mouseenter', () => {
            if (hoverSrc && hoverSrc !== normalSrc) {
                img.src = hoverSrc;
            }
        });
        
        img.addEventListener('mouseleave', () => {
            img.src = normalSrc;
        });
    });
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    Cart.add(product);
    Alert.success(`${product.name} added to cart!`);
    
    // Disable button temporarily
    const btn = document.querySelector(`.btn-add-cart[data-product-id="${productId}"]`);
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-check"></i> Added';
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
        }, 2000);
    }
}

// Buy now
function buyNow(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    Cart.add(product);
    Alert.success(`Redirecting to cart...`);
    
    setTimeout(() => {
        window.location.href = 'cart.html';
    }, 1000);
}

// Search functionality
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }
    
    applyFilters();
}

// Filter and sort
function handleFilter() {
    applyFilters();
}

function applyFilters() {
    let result = [...filteredProducts];
    
    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter && categoryFilter.value !== 'all') {
        result = result.filter(p => p.category === categoryFilter.value);
    }
    
    // Sort
    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) {
        switch(sortFilter.value) {
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
        }
    }
    
    displayProducts(result);
    
    // Update title
    const productsTitle = document.getElementById('productsTitle');
    if (productsTitle) {
        const count = result.length;
        productsTitle.textContent = count === products.length 
            ? 'All Products' 
            : `Found ${count} product${count !== 1 ? 's' : ''}`;
    }
}

// Wishlist functionality
function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        Alert.info('Removed from wishlist');
    } else {
        wishlist.push(productId);
        Alert.success('Added to wishlist');
    }
    
    Storage.set('wishlist', wishlist);
    updateWishlistButtons();
}

function isInWishlist(productId) {
    return wishlist.includes(productId);
}

function updateWishlistButtons() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const productId = parseInt(btn.dataset.productId);
        const icon = btn.querySelector('i');
        if (icon) {
            icon.classList.toggle('active', isInWishlist(productId));
        }
    });
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

