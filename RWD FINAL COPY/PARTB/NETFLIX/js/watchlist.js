// Watchlist / My List Functionality
class WatchlistManager {
    constructor() {
        this.watchlist = [];
        this.loadWatchlist();
        this.init();
    }

    init() {
        // Setup My List link
        const myListLink = document.getElementById('myListLink');
        if (myListLink) {
            myListLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showMyList();
            });
        }
    }

    loadWatchlist() {
        const saved = localStorage.getItem('netflix_watchlist');
        if (saved) {
            this.watchlist = JSON.parse(saved);
        }
    }

    saveWatchlist() {
        localStorage.setItem('netflix_watchlist', JSON.stringify(this.watchlist));
    }

    toggleWatchlist(movieId) {
        const index = this.watchlist.indexOf(movieId);
        
        if (index > -1) {
            // Remove from watchlist
            this.watchlist.splice(index, 1);
            this.showAlert(`${movieManager.getMovieById(movieId).title} removed from My List`);
        } else {
            // Add to watchlist
            this.watchlist.push(movieId);
            this.showAlert(`${movieManager.getMovieById(movieId).title} added to My List`);
        }

        this.saveWatchlist();
        this.updateWatchlistButton(movieId);
    }

    isInWatchlist(movieId) {
        return this.watchlist.includes(movieId);
    }

    updateWatchlistButton(movieId) {
        const button = document.querySelector(`.btn-add-list[onclick*="${movieId}"]`);
        if (button) {
            const isInList = this.isInWatchlist(movieId);
            if (isInList) {
                button.textContent = '✓ My List';
                button.classList.add('added');
            } else {
                button.textContent = '+ My List';
                button.classList.remove('added');
            }
        }
    }

    showMyList() {
        if (this.watchlist.length === 0) {
            alert('Your list is empty. Add movies to your list to see them here!');
            return;
        }

        // Hide all original sections
        const sections = ['trendingSection', 'top10Section', 'popularSection', 'topRatedSection'];
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.parentElement.style.display = 'none';
            }
        });

        // Hide search results if exists
        const searchResults = document.getElementById('searchResultsSection');
        if (searchResults) {
            searchResults.style.display = 'none';
        }

        // Create or update My List section
        let myListSection = document.getElementById('myListSection');
        if (!myListSection) {
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                myListSection = document.createElement('section');
                myListSection.className = 'movie-section';
                myListSection.id = 'myListSection';
                myListSection.innerHTML = `
                    <h2 class="section-title">My List</h2>
                    <div class="movie-grid" id="myListGrid"></div>
                `;
                mainContent.insertBefore(myListSection, mainContent.firstChild);
            }
        }

        // Get movies from watchlist
        const movies = this.watchlist.map(id => movieManager.getMovieById(id)).filter(m => m);

        // Display watchlist
        const myListGrid = document.getElementById('myListGrid');
        if (myListGrid) {
            if (movies.length === 0) {
                myListGrid.innerHTML = '<p style="color: #ccc;">Your list is empty.</p>';
            } else {
                mainApp.renderMovieSection('myListGrid', movies);
            }
        }

        // Show My List section
        if (myListSection) {
            myListSection.style.display = 'block';
        }

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        const myListLink = document.getElementById('myListLink');
        if (myListLink) {
            myListLink.classList.add('active');
        }
    }

    showAlert(message) {
        // Create alert element
        const alert = document.createElement('div');
        alert.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: #333;
            color: #fff;
            padding: 15px 20px;
            border-radius: 4px;
            z-index: 10000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;
        alert.textContent = message;
        document.body.appendChild(alert);

        // Remove after 3 seconds
        setTimeout(() => {
            alert.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(alert);
            }, 300);
        }, 3000);

        // Add animation styles if not exists
        if (!document.getElementById('alertAnimations')) {
            const style = document.createElement('style');
            style.id = 'alertAnimations';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
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
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize watchlist manager
const watchlistManager = new WatchlistManager();

