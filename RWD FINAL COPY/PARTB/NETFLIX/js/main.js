// Main Application Logic
class MainApp {
    constructor() {
        this.currentSlide = 0;
        this.featuredMovies = [];
        this.init();
    }

    init() {
        // Check authentication first
        if (!authManager.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }

        // Update auth buttons visibility
        authManager.updateAuthButtons();

        // Setup header scroll effect
        this.setupHeaderScroll();

        // Setup theme toggle
        this.setupThemeToggle();

        // Load and display movies
        this.loadFeaturedMovies();
        this.loadMovieSections();

        // Setup modal
        this.setupModal();

        // Setup slider
        this.setupSlider();
    }

    setupHeaderScroll() {
        const header = document.querySelector('.main-header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            // Load saved theme
            const savedTheme = localStorage.getItem('netflix_theme') || 'dark';
            this.setTheme(savedTheme);

            themeToggle.addEventListener('click', () => {
                const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                this.setTheme(newTheme);
            });
        }
    }

    setTheme(theme) {
        const themeToggle = document.getElementById('themeToggle');
        if (theme === 'light') {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            if (themeToggle) themeToggle.textContent = '☀️';
        } else {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            if (themeToggle) themeToggle.textContent = '🌙';
        }
        localStorage.setItem('netflix_theme', theme);
    }

    loadFeaturedMovies() {
        this.featuredMovies = movieManager.getFeaturedMovies();
        const slider = document.getElementById('featuredSlider');
        
        if (slider && this.featuredMovies.length > 0) {
            slider.innerHTML = '';
            this.featuredMovies.forEach((movie, index) => {
                const slide = document.createElement('div');
                slide.className = `featured-slide ${index === 0 ? 'active' : ''}`;
                slide.innerHTML = `
                    <img src="${movie.poster}" alt="${movie.title}" 
                         onerror="this.src='https://via.placeholder.com/1920x1080/000000/E50914?text=${encodeURIComponent(movie.title)}'; this.onerror=null;">
                    <div class="featured-info">
                        <h1>${movie.title}</h1>
                        <p>${movie.description.substring(0, 150)}...</p>
                        <div class="featured-buttons">
                            <button class="btn-play" onclick="mainApp.playTrailer(${movie.id})">▶ Play</button>
                            <button class="btn-info" onclick="mainApp.showMovieDetails(${movie.id})">ℹ️ More Info</button>
                        </div>
                    </div>
                `;
                slider.appendChild(slide);
            });
        }
    }

    loadMovieSections() {
        // Show all 7 movies only in Trending section to avoid duplicates
        this.renderMovieSection('trendingSection', movieManager.getTrendingMovies());
        
        // Hide other sections since we only have 7 movies
        const top10Section = document.getElementById('top10Section');
        const popularSection = document.getElementById('popularSection');
        const topRatedSection = document.getElementById('topRatedSection');
        
        if (top10Section) top10Section.parentElement.style.display = 'none';
        if (popularSection) popularSection.parentElement.style.display = 'none';
        if (topRatedSection) topRatedSection.parentElement.style.display = 'none';
    }

    renderMovieSection(sectionId, movies) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        section.innerHTML = '';
        movies.forEach(movie => {
            const card = document.createElement('div');
            card.className = 'movie-card';
            card.innerHTML = `
                <img src="${movie.poster}" alt="${movie.title}" class="movie-poster" 
                     onerror="this.src='https://via.placeholder.com/400x600/000000/E50914?text=${encodeURIComponent(movie.title)}'; this.onerror=null;">
                <div class="movie-overlay">
                    <h3 class="movie-title">${movie.title}</h3>
                    <div class="movie-rating">⭐ ${movie.rating}</div>
                </div>
            `;
            card.addEventListener('click', () => this.showMovieDetails(movie.id));
            section.appendChild(card);
        });
    }

    setupSlider() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSlide());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Auto-slide every 5 seconds
        setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.featuredMovies.length) % this.featuredMovies.length;
        this.updateSlider();
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.featuredMovies.length;
        this.updateSlider();
    }

    updateSlider() {
        const slides = document.querySelectorAll('.featured-slide');
        slides.forEach((slide, index) => {
            if (index === this.currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    }

    setupModal() {
        const modal = document.getElementById('movieModal');
        const closeBtn = document.getElementById('modalClose');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });

            // Close on ESC key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.style.display === 'block') {
                    this.closeModal();
                }
            });
        }
    }

    showMovieDetails(movieId) {
        const movie = movieManager.getMovieById(movieId);
        if (!movie) return;

        const modal = document.getElementById('movieModal');
        const modalBody = document.getElementById('modalBody');

        if (modal && modalBody) {
            const isInWatchlist = watchlistManager.isInWatchlist(movieId);
            const userRating = ratingManager.getRating(movieId);

            modalBody.innerHTML = `
                <img src="${movie.poster}" alt="${movie.title}" class="modal-poster" 
                     onerror="this.src='https://via.placeholder.com/400x600/000000/E50914?text=${encodeURIComponent(movie.title)}'; this.onerror=null;">
                <div class="modal-info">
                    <h2>${movie.title}</h2>
                    <div class="modal-meta">
                        <span>Year: ${movie.year}</span>
                        <span>Rating: ⭐ ${movie.rating}</span>
                        <span>Genre: ${movie.genre}</span>
                    </div>
                    <p class="modal-description">${movie.description}</p>
                    <div class="modal-actions">
                        <button class="btn-add-list ${isInWatchlist ? 'added' : ''}" 
                                onclick="watchlistManager.toggleWatchlist(${movie.id})">
                            ${isInWatchlist ? '✓ My List' : '+ My List'}
                        </button>
                        <button class="btn-trailer" onclick="mainApp.playTrailer(${movie.id})">
                            ▶ Watch Trailer
                        </button>
                    </div>
                    <div class="rating-container">
                        <label class="rating-label">Your Rating:</label>
                        <div class="rating-stars" id="ratingStars">
                            ${[1,2,3,4,5].map(i => `
                                <span class="star ${userRating >= i ? 'active' : ''}" 
                                      onclick="ratingManager.setRating(${movie.id}, ${i})">★</span>
                            `).join('')}
                        </div>
                        <div class="rating-display" id="ratingDisplay">
                            ${userRating ? `You rated this ${userRating}/5` : 'Not rated yet'}
                        </div>
                    </div>
                </div>
            `;
            modal.style.display = 'block';
        }
    }

    closeModal() {
        const modal = document.getElementById('movieModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    playTrailer(movieId) {
        const movie = movieManager.getMovieById(movieId);
        if (movie) {
            alert(`Playing trailer for: ${movie.title}\n\n(In a real application, this would play the actual trailer video.)`);
        }
    }
}

// Initialize main app
const mainApp = new MainApp();

