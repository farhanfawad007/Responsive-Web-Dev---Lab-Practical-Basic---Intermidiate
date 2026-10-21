// Create student object
let student = {
 name: "ABC",
 age: 21,
 course: "Computer Science",

 // Method to display details
 displayDetails: function() {
 return "Name: " + this.name + "<br>" +
 "Age: " + this.age + "<br>" +
 "Course: " + this.course;
 }
};
// Display student details in the HTML page
document.getElementById("details").innerHTML = student.displayDetails();