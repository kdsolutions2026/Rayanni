const WHATSAPP_NUMBER = '5500000000000';
const CART_KEY = 'rayanni-cart';

const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');
const filters = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('[data-category]');
const addCartButtons = document.querySelectorAll('[data-add-cart]');
const cartItemsNode = document.querySelector('[data-cart-items]');
const clearCartButton = document.querySelector('[data-clear-cart]');
const checkoutLink = document.querySelector('[data-whatsapp-checkout]');
const linkedCards = document.querySelectorAll('[data-card-link]');
const revealTargets = document.querySelectorAll(
  '.section-heading, .art-card, .feature-image, .feature-copy, .product-grid article, .contact > div, .contact-form, .cart-item'
);

const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) ?? [];
  } catch {
    return [];
  }
};

const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

const createFloatingCartButton = () => {
  const isInsidePagesFolder = window.location.pathname.includes('/pages/');
  const cartHref = isInsidePagesFolder ? 'carrinho.html' : 'pages/carrinho.html';

  const button = document.createElement('a');
  button.className = 'floating-cart-button';
  button.href = cartHref;
  button.setAttribute('aria-label', 'Abrir carrinho');
  button.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7 8h14l-1.6 8.2a2 2 0 0 1-2 1.6H9.2a2 2 0 0 1-2-1.6L5.6 4H3" />
      <circle cx="9.5" cy="21" r="1.4" />
      <circle cx="17.5" cy="21" r="1.4" />
    </svg>
    <span data-cart-count>0</span>
  `;

  document.body.appendChild(button);
};

const updateCartCount = () => {
  const total = readCart().length;
  document.querySelectorAll('[data-cart-count]').forEach((node) => {
    node.textContent = String(total);
  });
};

const buildWhatsAppUrl = () => {
  const cart = readCart();
  const lines = cart.map((item, index) => `${index + 1}. ${item.name} (${item.type}) - ${item.price}`);
  const message = cart.length
    ? `Oi, Rayanni! Tenho interesse nestes itens:\n\n${lines.join('\n')}\n\nPode me passar disponibilidade, valores e frete?`
    : 'Oi, Rayanni! Vim pelo site e quero saber mais sobre suas artes.';

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

const renderCart = () => {
  if (!cartItemsNode) {
    return;
  }

  const cart = readCart();

  if (!cart.length) {
    cartItemsNode.innerHTML = `
      <div class="empty-cart">
        <p class="eyebrow">Carrinho vazio</p>
        <h2>Nenhum item selecionado ainda.</h2>
        <p>Volte para artes ou necessaires e adicione os itens que chamarem atenção.</p>
        <a class="button primary" href="artes.html">Ver artes</a>
      </div>
    `;
  } else {
    cartItemsNode.innerHTML = cart.map((item) => `
      <article class="cart-item">
        <img src="${item.image}" alt="${item.name}" />
        <div>
          <h3>${item.name}</h3>
          <p>${item.type}</p>
          <p>${item.price}</p>
        </div>
        <button class="remove-cart" type="button" data-remove-cart="${item.id}">Remover</button>
      </article>
    `).join('');
  }

  if (checkoutLink) {
    checkoutLink.href = buildWhatsAppUrl();
    checkoutLink.classList.toggle('is-disabled', !cart.length);
  }
};

menuButton?.addEventListener('click', () => {
  const isOpen = nav?.classList.toggle('is-open') ?? false;
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

filters.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    filters.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');

    cards.forEach((card) => {
      const shouldShow = filter === 'todos' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !shouldShow);
    });
  });
});

linkedCards.forEach((card) => {
  card.addEventListener('click', (event) => {
    if (event.target.closest('a, button')) {
      return;
    }

    window.location.href = card.dataset.cardLink;
  });

  card.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    window.location.href = card.dataset.cardLink;
  });
});

addCartButtons.forEach((button) => {
  const id = button.dataset.id;
  if (readCart().some((item) => item.id === id)) {
    button.classList.add('is-added');
    button.textContent = 'Adicionado';
  }

  button.addEventListener('click', () => {
    const cart = readCart();
    const item = {
      id,
      name: button.dataset.name,
      type: button.dataset.type,
      price: button.dataset.price,
      image: button.dataset.image,
    };

    if (!cart.some((entry) => entry.id === id)) {
      cart.push(item);
      saveCart(cart);
    }

    button.classList.add('is-added');
    button.textContent = 'Adicionado';
    updateCartCount();
    renderCart();
  });
});

cartItemsNode?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-remove-cart]');
  if (!button) {
    return;
  }

  const nextCart = readCart().filter((item) => item.id !== button.dataset.removeCart);
  saveCart(nextCart);
  updateCartCount();
  renderCart();
});

clearCartButton?.addEventListener('click', () => {
  saveCart([]);
  updateCartCount();
  renderCart();
});

checkoutLink?.addEventListener('click', (event) => {
  const cart = readCart();

  if (!cart.length) {
    event.preventDefault();
    return;
  }

  event.preventDefault();
  window.open(buildWhatsAppUrl(), '_blank', 'noopener,noreferrer');
  saveCart([]);
  updateCartCount();
  renderCart();
});

const carousel = document.querySelector('[data-carousel]');
if (carousel) {
  const slides = [...carousel.querySelectorAll('.carousel-slide')];
  const prev = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');
  let current = 0;
  let carouselTimer;
  const carouselDelay = 5200;

  const showSlide = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === current);
    });
  };

  const startCarouselTimer = () => {
    window.clearTimeout(carouselTimer);
    carouselTimer = window.setTimeout(() => {
      showSlide(current + 1);
      startCarouselTimer();
    }, carouselDelay);
  };

  const handleManualSlide = (index) => {
    showSlide(index);
    startCarouselTimer();
  };

  prev?.addEventListener('click', () => handleManualSlide(current - 1));
  next?.addEventListener('click', () => handleManualSlide(current + 1));
  startCarouselTimer();
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16 }
  );

  revealTargets.forEach((target, index) => {
    target.classList.add('reveal');
    target.style.transitionDelay = `${Math.min(index * 0.04, 0.24)}s`;
    observer.observe(target);
  });
} else {
  revealTargets.forEach((target) => target.classList.add('is-visible'));
}

createFloatingCartButton();
updateCartCount();
renderCart();

