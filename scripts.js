document.addEventListener('DOMContentLoaded', () => {
    // Menú hamburguesa
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Carrito
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCart() {
        const countEl = document.getElementById('cart-count');
        if (countEl) {
            const count = cart.length;
            countEl.textContent = count;
            countEl.style.display = count > 0 ? 'flex' : 'none';
        }
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.producto-card');
            if (!card) return;

            const id = card.dataset.id;
            const name = card.dataset.name || card.querySelector('h3')?.textContent.trim();
            const price = parseInt(card.dataset.price) || 0;

            cart.push({ id, name, price });
            updateCart();
            alert('¡Agregado!');
        });
    });

    updateCart();

    // Modal
    const modal = document.getElementById('cart-modal');
    const cartToggle = document.getElementById('cart-toggle');
    const closeBtn = document.querySelector('.close');

    if (cartToggle && modal) {
        cartToggle.addEventListener('click', e => {
            e.preventDefault();
            modal.style.display = 'block';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.style.display = 'none');
    }

    window.addEventListener('click', e => {
        if (e.target === modal) modal.style.display = 'none';
    });
    // ==================== HEADER SCROLLED ====================
    window.addEventListener('scroll', () => {
        document.querySelector('.header')?.classList.toggle('scrolled', window.scrollY > 50);
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
});