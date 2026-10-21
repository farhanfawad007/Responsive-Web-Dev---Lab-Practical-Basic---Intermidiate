// Movies Data and Management
class MovieManager {
    constructor() {
        // Movies from the provided images
        this.movies = [
            {
                id: 1,
                title: "Jolly LL.B 3",
                poster: "Screenshot 2026-01-29 031820.png",
                description: "A hilarious courtroom comedy featuring Akshay Kumar and Arshad Warsi as lawyers who find themselves in a chaotic courtroom situation. Papers flying everywhere, a goat causing mayhem, and two lawyers desperately trying to maintain order in the most absurd legal proceedings imaginable. The film combines legal drama with slapstick comedy, delivering laughs and courtroom antics in equal measure.",
                year: 2024,
                rating: 8.2,
                genre: "Comedy",
                featured: true
            },
            {
                id: 2,
                title: "Mahaavatar Narsimha",
                poster: "images/mahaavatar-narsimha.jpg",
                description: "An epic mythological action film depicting the divine avatar of Lord Vishnu - Narsimha, the half-man, half-lion deity. The story showcases intense battles between good and evil, with Narsimha emerging from a golden divine portal to protect the righteous. Featuring dramatic golden lighting effects and powerful combat sequences, this film brings ancient mythology to life with stunning visuals and intense action.",
                year: 2024,
                rating: 8.5,
                genre: "Action",
                featured: true
            },
            {
                id: 3,
                title: "War 2",
                poster: "images/war-2.jpg",
                description: "An explosive action thriller starring two elite military operatives in tactical gear, armed with assault rifles and ready for combat. Set against a backdrop of urban warfare, military vehicles, and fighter jets, War 2 delivers high-octane action sequences with intense combat scenarios. The film features spectacular explosions, tactical operations, and a battle for survival in a war-torn landscape. Available in Hindi & Tamil.",
                year: 2024,
                rating: 8.7,
                genre: "Action",
                featured: true
            },
            {
                id: 4,
                title: "Dude",
                poster: "images/dude.jpg",
                description: "An intense action-drama featuring a man with a serious expression pointing directly at the viewer, set against a vibrant abstract background bursting with colors. The film promises high-energy sequences, dynamic action, and a compelling storyline that keeps audiences on the edge of their seats. With bold visual aesthetics and engaging performances, Dude delivers an action-packed cinematic experience.",
                year: 2024,
                rating: 7.9,
                genre: "Action",
                featured: true
            },
            {
                id: 5,
                title: "Hit: The Third Case",
                poster: "images/hit-third-case.jpg",
                description: "A gripping thriller following an intense investigation led by a determined detective with piercing eyes and a focused demeanor. Set in a dark, red-lit atmosphere that creates an atmosphere of suspense and mystery, the film follows the pursuit of a complex case that challenges everything the detective knows. With dramatic lighting and a serious tone, Hit: The Third Case delivers suspenseful storytelling and unexpected twists.",
                year: 2024,
                rating: 8.4,
                genre: "Thriller",
                featured: true
            },
            {
                id: 6,
                title: "Karate Kid Legends",
                poster: "images/karate-kid-legends.jpg",
                description: "An action-packed martial arts film that brings together multiple generations of characters from the beloved Karate Kid franchise. Featuring Mr. Miyagi, Daniel LaRusso, Johnny Lawrence, and the new generation including Miguel Diaz and Samantha LaRusso, the film showcases epic martial arts sequences against a backdrop of urban landscapes at sunset. Combining legacy characters with fresh faces, Karate Kid Legends delivers powerful fight scenes and the enduring spirit of martial arts.",
                year: 2024,
                rating: 8.6,
                genre: "Action",
                featured: true
            }
        ];
    }

    getFeaturedMovies() {
        return this.movies.filter(movie => movie.featured);
    }

    getTrendingMovies() {
        // Return all 6 movies sorted by rating
        return [...this.movies]
            .sort((a, b) => b.rating - a.rating);
    }

    getTop10Movies() {
        // Return all 6 movies
        return [...this.movies]
            .sort((a, b) => b.rating - a.rating);
    }

    getPopularMovies() {
        // Return all 6 movies
        return [...this.movies]
            .sort((a, b) => (b.year + b.rating) - (a.year + a.rating));
    }

    getTopRatedMovies() {
        // Return all 6 movies
        return [...this.movies]
            .sort((a, b) => b.rating - a.rating);
    }

    getMovieById(id) {
        return this.movies.find(movie => movie.id === parseInt(id));
    }

    searchMovies(query) {
        const lowerQuery = query.toLowerCase();
        return this.movies.filter(movie => 
            movie.title.toLowerCase().includes(lowerQuery) ||
            movie.description.toLowerCase().includes(lowerQuery)
        );
    }

    filterByGenre(genre) {
        if (!genre) return this.movies;
        return this.movies.filter(movie => movie.genre === genre);
    }
}

// Initialize movie manager
const movieManager = new MovieManager();

