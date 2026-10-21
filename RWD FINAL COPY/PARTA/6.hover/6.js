// Get the paragraph element
const para = document.getElementById("myPara");
// When mouse enters (hover)
para.onmouseover = function() {
 para.style.color = "blue";
 para.textContent = "You are hovering over me!";
};
// When mouse leaves
para.onmouseout = function() {
 para.style.color = "black";
 para.textContent = "Hover over this text to see the effect.";
};
