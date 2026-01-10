JavaScript// ==================== MENÚ HAMBURGUESA ====================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    console.log('Menú encontrado - JS OK');
    hamburger.addEventListener('click', () => {
        console.log('Click hamburguesa');
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
    console.error('Hamburger o nav-menu NO encontrados');
}

// ==================== HEADER SCROLLED ====================
window.addEventListener('scroll', () => {
    document.querySelector('.header')?.classList.toggle('scrolled', window.scrollY > 50);
});

// ==================== CARRITO ====================
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCart() {
    const countEl = document.getElementById('cart-count');
    if (countEl) {
        const count = cart.length;
        countEl.textContent = count;
        countEl.style.display = count > 0 ? 'flex' : 'none';
    }

    const itemsList = document.getElementById('cart-items');
    if (itemsList) {
        itemsList.innerHTML = cart.map(item => `
            <li>
                ${item.name} - $${item.price}
                <button class="remove-item" data-id="${item.id}">X</button>
            </li>
        `).join('');
    }

    const totalEl = document.getElementById('cart-total');
    if (totalEl) {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        totalEl.textContent = total.toLocaleString('es-AR');
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

// Agregar producto
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.producto-card');
        if (!card) return;

        const id = card.dataset.id;
        const name = card.dataset.name || card.querySelector('h3')?.textContent.trim();
        const priceStr = card.dataset.price || card.querySelector('.precio')?.textContent.replace('$', '').replace('.', '').trim();
        const price = parseInt(priceStr) || 0;

        if (!id || !name || !price) {
            alert('Error: datos del producto incompletos');
            return;
        }

        if (cart.some(item => item.id === id)) {
            alert('Ya está en el carrito');
            return;
        }

        cart.push({ id, name, price });
        updateCart();
        alert('¡Agregado!');
    });
});

// Remover (opcional)
document.addEventListener('click', e => {
    if (e.target.classList.contains('remove-item')) {
        const id = e.target.dataset.id;
        cart = cart.filter(item => item.id !== id);
        updateCart();
    }
});

// Inicializar carrito
updateCart();

// ==================== MODAL CARRITO ====================
const modal = document.getElementById('cart-modal');
const cartToggle = document.getElementById('cart-toggle');
const closeBtn = document.querySelector('.modal .close');

if (cartToggle) {
    cartToggle.addEventListener('click', e => {
        e.preventDefault();
        if (modal) modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        if (modal) modal.style.display = 'none';
        document.body.style.overflow = '';
    });
}

window.addEventListener('click', e => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
});

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