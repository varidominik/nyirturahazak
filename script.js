// ===== NAV SCROLL EFFECT =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== ÉRDEKLŐDÉSI MODAL =====
const overlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');

const houseNames = {
  1: 'Ikerház – A egység',
  2: 'Ikerház – B egység',
  3: 'Különálló Családi Ház'
};

function openModal(houseNum) {
  modalTitle.textContent = `Érdeklődöm: ${houseNames[houseNum]}`;
  modalDesc.textContent = 'Adja meg elérhetőségét, és 24 órán belül felvesszük Önnel a kapcsolatot.';
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeGallery(); }
});

document.getElementById('modalForm').addEventListener('submit', e => {
  e.preventDefault();
  closeModal();
  showToast('Köszönjük! Hamarosan felvesszük Önnel a kapcsolatot.');
});

document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  showToast('Üzenetét megkaptuk! Hamarosan válaszolunk.');
  e.target.reset();
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

let currentGalleryIndex = 0;
const galleryOverlay = document.getElementById('galleryOverlay');
const galleryImg = document.getElementById('galleryImg');
const galleryThumbs = document.getElementById('galleryThumbs');
const galleryCurrent = document.getElementById('galleryCurrent');
const galleryTotal = document.getElementById('galleryTotal');

// Build thumbnails
galleryTotal.textContent = galleryImages.length;
galleryImages.forEach((src, i) => {
  const thumb = document.createElement('img');
  thumb.src = src;
  thumb.alt = `Ikerház fotó ${i + 1}`;
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

// Keyboard navigation in gallery
document.addEventListener('keydown', e => {
  if (!galleryOverlay.classList.contains('open')) return;
  if (e.key === 'ArrowRight') galleryNext();
  if (e.key === 'ArrowLeft') galleryPrev();
});

// Touch swipe for gallery
let touchStartX = 0;
galleryOverlay.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });
galleryOverlay.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) dx < 0 ? galleryNext() : galleryPrev();
}, { passive: true });

// ===== TOAST =====
function showToast(msg) {
  const t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, {
    position: 'fixed', bottom: '32px', left: '50%',
    transform: 'translateX(-50%) translateY(20px)',
    background: '#1a1a18', color: '#fff',
    padding: '14px 24px', borderRadius: '100px',
    fontSize: '0.875rem', fontFamily: 'Inter, sans-serif',
    boxShadow: '0 4px 20px rgba(0,0,0,.25)',
    zIndex: '999', opacity: '0',
    transition: 'all .3s ease', whiteSpace: 'nowrap'
  });
  document.body.appendChild(t);
  requestAnimationFrame(() => {
    t.style.opacity = '1';
    t.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => t.remove(), 300);
  }, 3500);
}

// ===== SCROLL-IN ANIMATION =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.house-card, .badge, .why-item, .contact-method').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  observer.observe(el);
});
