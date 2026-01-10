document.addEventListener('DOMContentLoaded', () => {
    // Menú hamburguesa con animación suave y cierre inteligente
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Cierra menú al clickear links o fuera
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Carrito avanzado con animaciones y persistencia
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCart() {
        const countEl = document.getElementById('cart-count');
        if (countEl) {
            const count = cart.length;
            countEl.textContent = count;
            countEl.style.display = count > 0 ? 'flex' : 'none';
            if (count > 0) countEl.classList.add('pulse');
            setTimeout(() => countEl.classList.remove('pulse'), 600);
        }

        const itemsList = document.getElementById('cart-items');
        if (itemsList) {
            itemsList.innerHTML = cart.map(item => `
                <li class="cart-item">
                    <span>${item.name}</span>
                    <span>$${item.price.toLocaleString()}</span>
                    <button class="remove-item" data-id="${item.id}">×</button>
                </li>
            `).join('');
        }

        const totalEl = document.getElementById('cart-total');
        if (totalEl) {
            const total = cart.reduce((sum, item) => sum + item.price, 0);
            totalEl.textContent = total.toLocaleString();
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

            if (!id || !name || !price) return;

            if (cart.some(item => item.id === id)) {
                alert('Este producto ya está en tu carrito');
                return;
            }

            cart.push({ id, name, price });
            updateCart();
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => btn.style.transform = 'scale(1)', 100);
            alert('¡Producto agregado!');
        });
    });

    document.addEventListener('click', e => {
        if (e.target.classList.contains('remove-item')) {
            const id = e.target.dataset.id;
            cart = cart.filter(item => item.id !== id);
            updateCart();
        }
    });

    updateCart();

    // Modal carrito con fade
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

    // Newsletter popup con fade
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

    // Smooth scroll elegante
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href'))?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
});