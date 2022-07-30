var previous = document.querySelector(".prev");
var next = document.querySelector(".next");
var slides = document.getElementsByClassName("slide");
var current = 0;

// Code that moves to the next slide
next.addEventListener("click", function () {
  slides[current].classList.remove("active");
  current ++;
  if (current === slides.length)
    current = 0;
  slides[current].classList.add("active");
});

// Code that moves to the previous slide
previous.addEventListener("click", function () {
  slides[current].classList.remove("active");
  current --;
  if (current < 0)
    current = (slides.length - 1);
  slides[current].classList.add("active");
});