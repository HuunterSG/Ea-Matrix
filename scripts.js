document.addEventListener('DOMContentLoaded', () => {
    // Menú hamburguesa
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const menuCloseBtn = document.querySelector('.menu-close-btn');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open', hamburger.classList.contains('active'));
        });

        if (menuCloseBtn) {
            menuCloseBtn.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        }

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
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

        const itemsList = document.getElementById('cart-items');
        if (itemsList) {
            itemsList.innerHTML = cart.map(item => `
                <li>
                    ${item.name} - $${item.price}
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
            const name = card.dataset.name;
            const price = parseInt(card.dataset.price);

            if (cart.some(item => item.id === id)) {
                alert('Ya está en el carrito');
                return;
            }

            cart.push({ id, name, price });
            updateCart();
            alert('¡Agregado!');
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

    // Modal carrito
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

    // Newsletter popup
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
        alert('¡Suscrito!');
        popup.classList.remove('active');
        setTimeout(() => popup.style.display = 'none', 400);
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            document.querySelector(anchor.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
        });
    });
});