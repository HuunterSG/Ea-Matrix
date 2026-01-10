const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    console.log('Hamburger y navMenu encontrados → JS OK');
    hamburger.addEventListener('click', () => {
        console.log('Click en hamburguesa detectado');
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
} else {
    console.error('Hamburger o navMenu NO encontrados → revisa HTML');
}
// Header scrolled
window.addEventListener('scroll', () => {
    document.querySelector('.header').classList.toggle('scrolled', window.scrollY > 50);
});

// Slider productos (simple con touch)
let slideIndex = 0;
const slider = document.querySelector('.productos-slider');
const slides = slider.querySelectorAll('.producto-card');
const totalSlides = slides.length;
function showSlide(index) {
    slider.style.transform = `translateX(-${index * 100 / 3}%)`; // Muestra 3 por slide
}
document.querySelector('.prev').addEventListener('click', () => { slideIndex = (slideIndex - 1 + totalSlides) % totalSlides; showSlide(slideIndex); });
document.querySelector('.next').addEventListener('click', () => { slideIndex = (slideIndex + 1) % totalSlides; showSlide(slideIndex); });

// Carrito global
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Función única que actualiza TODO
function updateCart() {
    // Actualiza badge (siempre visible, oculta si 0)
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        const count = cart.length;
        countElement.textContent = count;
        countElement.style.display = count > 0 ? 'flex' : 'none';
    }

    // Actualiza lista en modal
    const itemsList = document.getElementById('cart-items');
    if (itemsList) {
        itemsList.innerHTML = cart.map(item => `
            <li>
                ${item.name} - $${item.price}
                <button class="remove-item" data-id="${item.id}">X</button>
            </li>
        `).join('');
    }

    // Calcula y muestra total
    const totalElement = document.getElementById('cart-total');
    if (totalElement) {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        totalElement.textContent = total.toLocaleString(); // formato bonito ARS
    }

    // Guarda en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Evento agregar al carrito
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.producto-card'); // mejor que parentElement
        if (!card) return;

        const id = card.dataset.id;
        const name = card.dataset.name;
        const price = parseInt(card.dataset.price);

        // Verifica si ya existe (evita duplicados)
        const existing = cart.find(item => item.id === id);
        if (existing) {
            alert('Este producto ya está en el carrito');
            return;
        }

        cart.push({ id, name, price });
        updateCart();
        alert('¡Agregado al carrito!');
    });
});

// Evento remover item (opcional pero útil)
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-item')) {
        const id = e.target.dataset.id;
        cart = cart.filter(item => item.id !== id);
        updateCart();
    }
});

// Cargar al inicio
updateCart(); // ← Esto es clave, llama al cargar la página

// Modal carrito - versión mejorada
const modal = document.getElementById('cart-modal');
if (!modal) {
    console.warn('Modal con id "cart-modal" no encontrado');
    return; // Salir temprano si no existe
}

const cartLink = document.querySelector('.cart-icon a');
const closeBtn = document.querySelector('.close'); // Cambié a closeBtn para claridad

// Abrir modal
if (cartLink) {
    cartLink.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // ← Evita scroll en body (buena práctica mobile)
    });
}

// Cerrar con botón X
if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal());
}

// Cerrar click fuera (overlay)
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Función auxiliar para cerrar (reutilizable)
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // ← Restaura scroll
}

// Opcional: cerrar con tecla ESC (mejora UX)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});
// Formulario contacto con EmailJS
document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    emailjs.send('TU_SERVICE_ID', 'TU_TEMPLATE_ID', {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    }).then(() => alert('¡Mensaje enviado! Te contactaremos pronto.'), () => alert('Error al enviar.'));
    e.target.reset();
});

// Popup newsletter (aparece después de 5s)
setTimeout(() => document.getElementById('newsletter-popup').style.display = 'block', 5000);
document.querySelector('.close-popup').addEventListener('click', () => document.getElementById('newsletter-popup').style.display = 'none');
document.getElementById('newsletter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('¡Suscrito! Recibirás ofertas exclusivas.');
    document.getElementById('newsletter-popup').style.display = 'none';
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector(anchor.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});