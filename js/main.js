// Referencias principales del DOM para navegación y utilidades globales.
const menuBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
const yearElement = document.querySelector('#year');
const navLinks = document.querySelectorAll('#site-nav a');

// Elementos de la galería y del lightbox para ampliar imágenes.
const galleryItems = document.querySelectorAll('.gallery-item img');
const lightbox = document.querySelector('#lightbox');
const lightboxImg = document.querySelector('.lightbox__img');
const lightboxClose = document.querySelector('.lightbox__close');

// Elementos del formulario de reservas y nodos para microanimaciones.
const reservationForm = document.querySelector('#reservation-form');
const formMessage = document.querySelector('#form-message');
const revealTargets = document.querySelectorAll(
  '.card, .pricing-table, .gallery-item, .map-wrap, .location-details, .cta-band, .reservation-form'
);

// Inserta el año actual en el footer automáticamente.
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Control de menú móvil: abrir/cerrar y actualizar estado accesible.
if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  // Al elegir un enlace del menú, lo cerramos en móvil.
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

// Lógica del lightbox: abrir imagen ampliada y permitir cierre.
if (lightbox && lightboxImg && lightboxClose && galleryItems.length > 0) {
  // Al hacer click en miniatura, copia source/alt al modal.
  galleryItems.forEach((img) => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });

  // Función centralizada para cerrar modal y limpiar estado.
  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    lightboxImg.alt = '';
  };

  // Cierre por botón.
  lightboxClose.addEventListener('click', closeLightbox);

  // Cierre al hacer click fuera de la imagen.
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  // Cierre con tecla ESC para mejor UX/accesibilidad.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });
}

// Formulario de reservas: validación básica + apertura de WhatsApp prellenado.
if (reservationForm) {
  reservationForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Captura y normaliza datos del formulario.
    const formData = new FormData(reservationForm);
    const name = String(formData.get('name') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const service = String(formData.get('service') || '').trim();
    const date = String(formData.get('date') || '').trim();
    const time = String(formData.get('time') || '').trim();
    const submitBtn = reservationForm.querySelector('button[type="submit"]');

    // Teléfono con formato flexible: números, +, espacios y guiones.
    const phoneRegex = /^[0-9+\s-]{7,16}$/;

    // Limpia estado visual previo de errores.
    const fields = reservationForm.querySelectorAll('input, select');
    fields.forEach((field) => field.classList.remove('input-error'));

    // Valida campos obligatorios.
    if (!name || !phone || !service || !date || !time) {
      if (formMessage) {
        formMessage.textContent = 'Completa todos los campos obligatorios para reservar.';
        formMessage.className = 'form-message error';
      }

      // Marca visualmente campos vacíos.
      fields.forEach((field) => {
        if (!field.value) {
          field.classList.add('input-error');
        }
      });
      return;
    }

    // Valida formato de teléfono.
    if (!phoneRegex.test(phone)) {
      const phoneField = reservationForm.querySelector('input[name="phone"]');
      if (phoneField) {
        phoneField.classList.add('input-error');
      }
      if (formMessage) {
        formMessage.textContent = 'Ingresa un teléfono válido.';
        formMessage.className = 'form-message error';
      }
      return;
    }

    // Mensaje de éxito previo y estado de carga del botón.
    if (formMessage) {
      formMessage.textContent = 'Abriendo WhatsApp con tu reserva...';
      formMessage.className = 'form-message success';
    }

    if (submitBtn) {
      submitBtn.classList.add('is-loading');
      submitBtn.textContent = 'Enviando...';
    }

    // Construye el mensaje final que llegará al WhatsApp del negocio.
    const message = encodeURIComponent(
      `Hola, quiero agendar un corte ✂\nNombre: ${name}\nTeléfono: ${phone}\nServicio: ${service}\nFecha: ${date}\nHora: ${time}`
    );

    // Pequeño delay para reforzar percepción de envío.
    setTimeout(() => {
      window.open(`https://wa.me/573145742701?text=${message}`, '_blank', 'noopener,noreferrer');

      // Restaura botón después de abrir WhatsApp.
      if (submitBtn) {
        submitBtn.classList.remove('is-loading');
        submitBtn.textContent = 'Reservar por WhatsApp';
      }
    }, 350);
  });
}

// Microanimaciones on-scroll para revelar bloques al entrar en viewport.
if (revealTargets.length > 0) {
  // Estado inicial oculto.
  revealTargets.forEach((item) => item.classList.add('reveal'));

  // Observador de intersección para activar una sola vez por elemento.
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  // Registra cada elemento animable.
  revealTargets.forEach((item) => revealObserver.observe(item));
}
