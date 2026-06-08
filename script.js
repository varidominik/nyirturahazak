// ===== NAV SCROLL EFFECT =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ===== MOBILE BURGER =====
const burger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== KÉPGALÉRIA =====
const galleryImages = [
  'images/ikerhaz-01.jpg',
  'images/ikerhaz-02.jpg',
  'images/ikerhaz-03.jpg',
  'images/ikerhaz-04.jpg',
  'images/ikerhaz-05.jpg',
  'images/ikerhaz-06.jpg',
  'images/ikerhaz-07.jpg',
];

// Build gallery grid
const galleryGrid = document.getElementById('galleryGrid');
galleryImages.forEach((src, i) => {
  const item = document.createElement('div');
  item.className = 'gallery-grid-item';
  const img = document.createElement('img');
  img.src = src;
  img.alt = `Látványterv ${i + 1}`;
  img.loading = 'lazy';
  item.appendChild(img);
  item.addEventListener('click', () => openGallery(i));
  galleryGrid.appendChild(item);
});

let currentGalleryIndex = 0;
const galleryOverlay = document.getElementById('galleryOverlay');
const galleryImg = document.getElementById('galleryImg');
const galleryThumbs = document.getElementById('galleryThumbs');
const galleryCurrent = document.getElementById('galleryCurrent');
const galleryTotal = document.getElementById('galleryTotal');

galleryTotal.textContent = galleryImages.length;
galleryImages.forEach((src, i) => {
  const thumb = document.createElement('img');
  thumb.src = src;
  thumb.alt = `Látványterv ${i + 1}`;
  thumb.className = 'gallery-thumb' + (i === 0 ? ' active' : '');
  thumb.addEventListener('click', () => setGalleryIndex(i));
  galleryThumbs.appendChild(thumb);
});

function setGalleryIndex(i) {
  currentGalleryIndex = i;
  galleryImg.src = galleryImages[i];
  galleryCurrent.textContent = i + 1;
  document.querySelectorAll('.gallery-thumb').forEach((t, idx) => {
    t.classList.toggle('active', idx === i);
  });
}

function openGallery(startIndex = 0) {
  setGalleryIndex(startIndex);
  galleryOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeGallery() {
  galleryOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

function galleryNext() {
  setGalleryIndex((currentGalleryIndex + 1) % galleryImages.length);
}

function galleryPrev() {
  setGalleryIndex((currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeGallery();
  if (!galleryOverlay.classList.contains('open')) return;
  if (e.key === 'ArrowRight') galleryNext();
  if (e.key === 'ArrowLeft') galleryPrev();
});

let touchStartX = 0;
galleryOverlay.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });
galleryOverlay.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) dx < 0 ? galleryNext() : galleryPrev();
}, { passive: true });

// ===== GSAP ANIMÁCIÓK =====
gsap.registerPlugin(ScrollTrigger);

// Hero: belépő animáció (nincs scroll trigger, lapbetöltéskor fut)
const heroFades = document.querySelectorAll('.hero .gsap-fade');
gsap.from(heroFades, {
  opacity: 0,
  y: 32,
  duration: 0.9,
  ease: 'power3.out',
  stagger: 0.14,
  delay: 0.2,
});

// Scroll-triggered animációk: szekciócímek és tartalom
document.querySelectorAll('.gsap-up').forEach(el => {
  gsap.from(el, {
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
      toggleActions: 'play none none none',
    },
    opacity: 0,
    y: 36,
    duration: 0.75,
    ease: 'power3.out',
  });
});

// Kártyák: stagger animáció – fromTo + toArray a megbízható megoldás
[
  { trigger: '.about-badges', selector: '.badge' },
  { trigger: '.houses-grid', selector: '.gsap-card' },
  { trigger: '.why-grid', selector: '.why-item' },
].forEach(({ trigger, selector }) => {
  const triggerEl = document.querySelector(trigger);
  if (!triggerEl) return;
  const els = gsap.utils.toArray(triggerEl.querySelectorAll(selector));
  if (!els.length) return;
  gsap.fromTo(els,
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0,
      duration: 0.7, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: { trigger: triggerEl, start: 'top 82%' }
    }
  );
});

// Galéria grid fotók stagger
const galleryGridEl = document.querySelector('.gallery-grid');
if (galleryGridEl) {
  const galleryItems = gsap.utils.toArray(galleryGridEl.querySelectorAll('.gallery-grid-item'));
  gsap.fromTo(galleryItems,
    { opacity: 0, scale: 0.96 },
    {
      opacity: 1, scale: 1,
      duration: 0.6, ease: 'power2.out', stagger: 0.07,
      scrollTrigger: { trigger: galleryGridEl, start: 'top 85%' }
    }
  );
}

// Kapcsolati módszerek
const contactMethodsEl = document.querySelector('.contact-methods');
if (contactMethodsEl) {
  const methodEls = gsap.utils.toArray(contactMethodsEl.querySelectorAll('.contact-method'));
  gsap.fromTo(methodEls,
    { opacity: 0, y: 24 },
    {
      opacity: 1, y: 0,
      duration: 0.65, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: { trigger: contactMethodsEl, start: 'top 88%' }
    }
  );
}
