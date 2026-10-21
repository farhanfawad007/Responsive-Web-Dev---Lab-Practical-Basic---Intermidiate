// Rating System
class RatingManager {
    constructor() {
        this.ratings = {};
        this.loadRatings();
    }

    loadRatings() {
        const saved = localStorage.getItem('netflix_ratings');
        if (saved) {
            this.ratings = JSON.parse(saved);
        }
    }

    saveRatings() {
        localStorage.setItem('netflix_ratings', JSON.stringify(this.ratings));
    }

    setRating(movieId, rating) {
        this.ratings[movieId] = rating;
        this.saveRatings();
        this.updateRatingDisplay(movieId, rating);
        this.updateRatingStars(movieId, rating);

        const movie = movieManager.getMovieById(movieId);
        if (movie) {
            this.showRatingConfirmation(movie.title, rating);
        }
    }

    getRating(movieId) {
        return this.ratings[movieId] || 0;
    }

    updateRatingDisplay(movieId, rating) {
        const display = document.getElementById('ratingDisplay');
        if (display) {
            display.textContent = `You rated this ${rating}/5`;
        }
    }

    updateRatingStars(movieId, rating) {
        const stars = document.querySelectorAll('#ratingStars .star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    showRatingConfirmation(title, rating) {
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
        alert.innerHTML = `You rated <strong>${title}</strong> ${rating}/5 ${'★'.repeat(rating)}`;
        document.body.appendChild(alert);

        // Remove after 3 seconds
        setTimeout(() => {
            alert.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(alert)) {
                    document.body.removeChild(alert);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize rating manager
const ratingManager = new RatingManager();

