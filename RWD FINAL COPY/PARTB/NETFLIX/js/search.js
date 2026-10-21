// Search and Filter Functionality
class SearchManager {
    constructor() {
        this.currentResults = [];
        this.init();
    }

    init() {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const genreFilter = document.getElementById('genreFilter');

        if (searchInput) {
            // Real-time search
            searchInput.addEventListener('input', (e) => {
                this.performSearch(e.target.value);
            });

            // Search on button click
            if (searchBtn) {
                searchBtn.addEventListener('click', () => {
                    this.performSearch(searchInput.value);
                });
            }

            // Search on Enter key
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(searchInput.value);
                }
            });
        }

        if (genreFilter) {
            genreFilter.addEventListener('change', (e) => {
                this.applyFilter(e.target.value);
            });
        }
    }

    performSearch(query) {
        if (!query.trim()) {
            // If search is empty, restore original sections
            mainApp.loadMovieSections();
            return;
        }

        const results = movieManager.searchMovies(query);
        this.currentResults = results;
        this.displaySearchResults(results);
    }

    applyFilter(genre) {
        const searchInput = document.getElementById('searchInput');
        const searchQuery = searchInput ? searchInput.value : '';

        let results;
        if (searchQuery.trim()) {
            // If there's a search query, filter the search results
            const searchResults = movieManager.searchMovies(searchQuery);
            results = genre ? searchResults.filter(m => m.genre === genre) : searchResults;
        } else {
            // Otherwise, filter all movies by genre
            results = genre ? movieManager.filterByGenre(genre) : movieManager.movies;
        }

        this.displaySearchResults(results);
    }

    displaySearchResults(movies) {
        // Hide all original sections
        const sections = ['trendingSection', 'top10Section', 'popularSection', 'topRatedSection'];
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.parentElement.style.display = 'none';
            }
        });

        // Create or update search results section
        let resultsSection = document.getElementById('searchResultsSection');
        if (!resultsSection) {
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                resultsSection = document.createElement('section');
                resultsSection.className = 'movie-section';
                resultsSection.id = 'searchResultsSection';
                resultsSection.innerHTML = `
                    <h2 class="section-title">Search Results (${movies.length})</h2>
                    <div class="movie-grid" id="searchResultsGrid"></div>
                `;
                mainContent.insertBefore(resultsSection, mainContent.firstChild);
            }
        } else {
            const title = resultsSection.querySelector('.section-title');
            if (title) {
                title.textContent = `Search Results (${movies.length})`;
            }
        }

        // Display results
        const resultsGrid = document.getElementById('searchResultsGrid');
        if (resultsGrid) {
            mainApp.renderMovieSection('searchResultsGrid', movies);
        }

        // Show results section
        if (resultsSection) {
            resultsSection.style.display = 'block';
        }
    }

    clearSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }

        // Remove search results section
        const resultsSection = document.getElementById('searchResultsSection');
        if (resultsSection) {
            resultsSection.remove();
        }

        // Show only trending section (others are hidden since we only have 7 movies)
        const trendingSection = document.getElementById('trendingSection');
        if (trendingSection) {
            trendingSection.parentElement.style.display = 'block';
        }
        
        // Keep other sections hidden
        const top10Section = document.getElementById('top10Section');
        const popularSection = document.getElementById('popularSection');
        const topRatedSection = document.getElementById('topRatedSection');
        
        if (top10Section) top10Section.parentElement.style.display = 'none';
        if (popularSection) popularSection.parentElement.style.display = 'none';
        if (topRatedSection) topRatedSection.parentElement.style.display = 'none';
    }
}

// Initialize search manager
const searchManager = new SearchManager();

