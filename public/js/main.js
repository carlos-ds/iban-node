// Toggle class for active navigation item
const navLinks = document.querySelectorAll("#menu ul li a");
navLinks.forEach(function (link) {
    if (link.pathname === document.location.pathname) {
        link.classList.add("active");
    } else {
        link.classList.remove("active");
    }
});




