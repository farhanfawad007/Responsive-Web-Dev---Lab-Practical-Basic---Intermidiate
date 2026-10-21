// Array with image paths
let images = [
    "https://via.placeholder.com/300x200?text=Image+1",
    "https://via.placeholder.com/300x200?text=Image+2",
    "https://via.placeholder.com/300x200?text=Image+3"
];

let index = 0; // Current image index

// Function to show image
function showImage() {
    document.getElementById("slider").src = images[index];
}

// Next button function
function nextImage() {
    index++;
    if (index >= images.length) {
        index = 0; // Loop back to first image
    }
    showImage();
}

// Previous button function
function prevImage() {
    index--;
    if (index < 0) {
        index = images.length - 1; // Go to last image
    }
    showImage();
}

// Show first image on page load
showImage();
