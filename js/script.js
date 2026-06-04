const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');
const filters = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('[data-category]');
const revealTargets = document.querySelectorAll(
  '.section-heading, .art-card, .feature-image, .feature-copy, .product-grid article, .contact > div, .contact-form'
);

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
