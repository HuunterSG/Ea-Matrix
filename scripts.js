// Menú hamburguesa para móvil
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Slider básico para productos (muestra 1-3 cards, avanza con botones)
let slideIndex = 0;
const slides = document.querySelectorAll('.producto-card');
const totalSlides = slides.length;

function cambiarSlide(n) {
    slideIndex += n;
    if (slideIndex >= totalSlides) slideIndex = 0;
    if (slideIndex < 0) slideIndex = totalSlides - 1;
    
    // Oculta todas las cards y muestra solo las primeras 3 (o ajusta)
    slides.forEach((slide, i) => {
        slide.style.display = (i < 3) ? 'block' : 'none'; // Muestra 3 por "slide"
    });
}

// Formulario de contacto
const form = document.getElementById('contact-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('¡Mensaje enviado! Te contactaremos pronto vía email o Instagram.'); // Reemplaza con email real (usa Formspree o similar)
    form.reset();
});

// Smooth scroll para enlaces
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});