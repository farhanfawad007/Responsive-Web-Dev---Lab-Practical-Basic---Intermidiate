// 1. Display the current date and time
let now = new Date();
document.getElementById("dateTime").innerHTML =
    "Current Date and Time: " + now;

// 2. Calculate the square root of a number
let number = 25; // You can change this number
let sqrt = Math.sqrt(number);
document.getElementById("squareRoot").innerHTML =
    "Square root of " + number + " is: " + sqrt;

// 3. Convert a string to uppercase
let str = "hello javascript!";
let upper = str.toUpperCase();
document.getElementById("uppercase").innerHTML =
    "Uppercase string: " + upper;

// 4. Add elements dynamically to an array
let arr = [];
arr.push("Apple");
arr.push("Banana");
arr.push("Cherry");
document.getElementById("arrayElements").innerHTML =
    "Array elements: " + arr.join(", ");
