// script.js - Frontend completo de EA Matrix
// Todo se ejecuta después de que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {

// Función para cargar páginas dentro del index
async function loadPage(page) {
    const mainContent = document.getElementById('main-content');
    try {
        const response = await fetch(page);
        const html = await response.text();
        // Extraemos solo lo que está dentro de las etiquetas body o section si es necesario
        mainContent.innerHTML = html; 
    } catch (error) {
        mainContent.innerHTML = "<h2>Error al cargar la sección</h2>";
    }
}

// Cargar Home por defecto
loadPage('home.html');

// Escuchar los clics del menú para que no recarguen la página
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        const page = link.getAttribute('href');
        if(page.endsWith('.html')) {
            e.preventDefault(); // Evita que el navegador salte a otra página
            loadPage(page);
        }
    });
});
    // ========================================
    // MENÚ HAMBURGUESA (mobile) - Animación X + botón cerrar
    // ========================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const menuCloseBtn = document.querySelector('.menu-close-btn');

    if (hamburger && navMenu) {
        // Toggle menú al clickear hamburguesa
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open', hamburger.classList.contains('active'));
        });

        // Cerrar menú con botón "Cerrar" interno
        if (menuCloseBtn) {
            menuCloseBtn.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        }

        // Cerrar menú al clickear cualquier link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // ========================================
    // CARRITO - Persistencia con localStorage
    // ========================================
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Función que actualiza badge, lista del modal y total
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
                    ${item.name} - $${item.price.toLocaleString('es-AR')}
                    <button class="remove-item" data-id="${item.id}">×</button>
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

    // Agregar producto al carrito
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.producto-card');
            if (!card) return;

            const id = card.dataset.id;
            const name = card.dataset.name || card.querySelector('h3')?.textContent.trim();
            const price = parseInt(card.dataset.price) || 0;

            if (!id || !name || !price) {
                alert('Error: datos del producto incompletos');
                return;
            }

            // Evitar duplicados
            if (cart.some(item => item.id === id)) {
                alert('Este producto ya está en el carrito');
                return;
            }

            cart.push({ id, name, price });
            updateCart();
            alert('¡Producto agregado al carrito!');
        });
    });

    // Remover producto del carrito
    document.addEventListener('click', e => {
        if (e.target.classList.contains('remove-item')) {
            const id = e.target.dataset.id;
            cart = cart.filter(item => item.id !== id);
            updateCart();
        }
    });

    // Inicializar carrito al cargar
    updateCart();

    // ========================================
    // MODAL CARRITO - Responsive con fade
    // ========================================
    const modal = document.getElementById('cart-modal');
    const cartToggle = document.getElementById('cart-toggle');
    const closeBtn = document.querySelector('.close');

    if (cartToggle && modal) {
        cartToggle.addEventListener('click', e => {
            e.preventDefault();
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 400);
        });
    }

    window.addEventListener('click', e => {
        if (e.target === modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 400);
        }
    });

    // ========================================
    // CHECKOUT MERCADO PAGO
    // ========================================
    document.getElementById('checkout-btn')?.addEventListener('click', async () => {
        try {
            const response = await fetch('https://tu-backend.vercel.app/create-preference', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: cart })
            });

            if (!response.ok) throw new Error('Error en el servidor');
            const { id } = await response.json();

            const mp = new MercadoPago('TU_PUBLIC_KEY'); // Reemplaza con tu PUBLIC_KEY
            mp.checkout({
                preference: { id },
                autoOpen: true
            });
        } catch (error) {
            alert('Error al iniciar el pago. Intenta de nuevo.');
            console.error(error);
        }
    });

    // ========================================
    // POPUP NEWSLETTER - Aparece después de 5s con fade
    // ========================================
    const popup = document.getElementById('newsletter-popup');
    if (popup) {
        setTimeout(() => {
            popup.style.display = 'flex';
            setTimeout(() => popup.classList.add('active'), 50);
        }, 5000);
    }

    document.querySelector('.close-popup')?.addEventListener('click', () => {
        popup.classList.remove('active');
        setTimeout(() => popup.style.display = 'none', 400);
    });

    document.getElementById('newsletter-form')?.addEventListener('submit', e => {
        e.preventDefault();
        alert('¡Suscrito con éxito!');
        popup.classList.remove('active');
        setTimeout(() => popup.style.display = 'none', 400);
    });

    // ========================================
    // SMOOTH SCROLL - Para todos los links internos
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            document.querySelector(anchor.getAttribute('href'))?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    // ========================================
    // FORMULARIO CONTACTO - EmailJS
    // ========================================
    document.getElementById('contact-form')?.addEventListener('submit', e => {
        e.preventDefault();
        emailjs.send('TU_SERVICE_ID', 'TU_TEMPLATE_ID', {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        }).then(() => {
            alert('¡Mensaje enviado! Te contactaremos pronto.');
            e.target.reset();
        }).catch(() => alert('Error al enviar mensaje.'));
    });
});