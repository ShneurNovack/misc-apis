 if (typeof calculateTickets === 'function') {
 calculateTickets();
 if (packages !== null && typeof packages.change === 'function') {
 packages.change(calculateTickets);
 }
 }
 document.addEventListener("DOMContentLoaded", function() {
 var checkbox = document.getElementById("ToggleMobileNav");
 var templateElement = document.querySelector(".chabad_navigator_bar");

 if (checkbox && templateElement) {
 // Add event listener to checkbox
 checkbox.addEventListener("change", function() {
 // Set checkbox checked state based on template element
 checkbox.checked = templateElement.checked;
 });

 // Initialize checkbox state based on template element
 checkbox.checked = templateElement.checked;
 }
 });


var styleTag = document.createElement('style');
styleTag.type = 'text/css';
styleTag.innerHTML = '#BodyContainer { display: none!important; }'; // CSS rule
document.head.appendChild(styleTag); // Append the style tag to the <head>

 jQuery(window).load(function () {});
 jQuery(document).ready(function ($) {
 $("#news-slider").owlCarousel({
 items: 3,
 itemsDesktop: [1199, 3],
 itemsDesktopSmall: [980, 2],
 itemsMobile: [600, 1],
 navigation: true,
 navigationText: ["", ""],
 pagination: true,
 autoPlay: true
 });
 });
 jQuery(document).ready(function ($) {
 $('#news-slider').owlCarousel({
 loop: true,
 margin: 10,
 nav: true,
 responsive: {
 0: {
 items: 1
 },
 480: {
 items: 2
 },
 768: {
 items: 3
 },
 992: {
 items: 4
 }
 }
 });
 });
