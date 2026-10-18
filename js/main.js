/**
 * DEMO - Royal Fine Dining & Luxury Lounge
 * Interactive Engine & UI Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Preloader Handling
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(() => preloader.style.display = 'none', 600);
      }
    }, 450);
  });

  // Fallback in case load event already fired
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
      setTimeout(() => preloader.style.display = 'none', 600);
    }
  }, 1800);

  // 2. Sticky Navbar & Header Scroll State
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    if (scrollY > 400) {
      backToTop?.classList.add('show');
    } else {
      backToTop?.classList.remove('show');
    }

    updateActiveNavLink();
  });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // 3. Mobile Navigation Drawer
  const menuToggle = document.getElementById('menuToggle');
  const closeDrawer = document.getElementById('closeDrawer');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-res-btn');

  function openMobileMenu() {
    mobileDrawer?.classList.add('active');
    drawerOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileDrawer?.classList.remove('active');
    drawerOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  menuToggle?.addEventListener('click', openMobileMenu);
  closeDrawer?.addEventListener('click', closeMobileMenu);
  drawerOverlay?.addEventListener('click', closeMobileMenu);
  drawerLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

  // 4. Scroll Spy for Active Navigation Link
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNavLink() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // 5. Hero Metric Counters Animation
  const metricNumbers = document.querySelectorAll('.metric-number');
  let metricsAnimated = false;

  function animateCounters() {
    metricNumbers.forEach(counter => {
      const target = +counter.getAttribute('data-count');
      const duration = 2000;
      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuad = 1 - (1 - progress) * (1 - progress);
        const currentCount = Math.floor(easeOutQuad * target);

        counter.textContent = currentCount;

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(updateNumber);
    });
  }

  const metricsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !metricsAnimated) {
        metricsAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.3 });

  const heroMetrics = document.querySelector('.hero-metrics');
  if (heroMetrics) metricsObserver.observe(heroMetrics);

  // 6. Menu Filter Tabs
  const filterBtns = document.querySelectorAll('.menu-cat-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-category');

      menuCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (filter === 'all' || cardCat === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // 7. Seating Pills Selector
  const seatPills = document.querySelectorAll('.seat-pill');
  const selectedSeatInput = document.getElementById('selectedSeat');

  seatPills.forEach(pill => {
    pill.addEventListener('click', () => {
      seatPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      if (selectedSeatInput) {
        selectedSeatInput.value = pill.getAttribute('data-seat') || '';
      }
    });
  });

  // Set reservation date minimum to today
  const resDateInput = document.getElementById('resDate');
  if (resDateInput) {
    const today = new Date().toISOString().split('T')[0];
    resDateInput.min = today;
    resDateInput.value = today;
  }

  // 8. Interactive Table Reservation & Modal Confirmation
  const resForm = document.getElementById('resForm');
  const confirmationModal = document.getElementById('confirmationModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalDoneBtn = document.getElementById('modalDoneBtn');

  resForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('resName').value;
    const guests = document.getElementById('resGuests').value;
    const dateVal = document.getElementById('resDate').value;
    const time = document.getElementById('resTime').value;
    const seat = selectedSeatInput?.value || 'Main Gold Atrium';

    // Format date nicely
    let formattedDate = dateVal;
    try {
      const d = new Date(dateVal + 'T12:00:00');
      formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (_) {}

    // Populate modal ticket
    const randomId = '#DEMO-' + Math.floor(1000 + Math.random() * 9000);
    document.getElementById('modalBookingId').textContent = randomId;
    document.getElementById('modalGuestName').textContent = name;
    document.getElementById('modalGuestCount').textContent = guests;
    document.getElementById('modalDateTime').textContent = `${formattedDate} at ${time.split(' - ')[0]}`;
    document.getElementById('modalSeatingArea').textContent = seat;

    // Show modal & trigger celebration confetti
    confirmationModal?.classList.add('active');
    triggerGoldConfetti();
  });

  function closeBookingModal() {
    confirmationModal?.classList.remove('active');
    resForm?.reset();
    if (resDateInput) {
      resDateInput.value = new Date().toISOString().split('T')[0];
    }
  }

  closeModalBtn?.addEventListener('click', closeBookingModal);
  modalDoneBtn?.addEventListener('click', closeBookingModal);
  confirmationModal?.addEventListener('click', (e) => {
    if (e.target === confirmationModal) closeBookingModal();
  });

  // 9. Interactive Online Cart / Order Tray Drawer
  let cart = [];
  const openCartBtn = document.getElementById('openCartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartCountBadge = document.getElementById('cartCount');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartGratuityEl = document.getElementById('cartGratuity');
  const cartTotalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  function openCart() {
    cartDrawer?.classList.add('active');
    cartOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawer?.classList.remove('active');
    cartOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  openCartBtn?.addEventListener('click', openCart);
  closeCartBtn?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);

  // Add to cart buttons on dishes
  const addButtons = document.querySelectorAll('.add-to-cart-btn');
  addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const title = btn.getAttribute('data-title');
      const price = parseFloat(btn.getAttribute('data-price') || '0');
      const img = btn.getAttribute('data-img');

      addToCart(id, title, price, img);

      // Micro-animation on button
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Added';
      btn.classList.add('added');
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('added');
      }, 1200);
    });
  });

  function addToCart(id, title, price, img) {
    const existingIndex = cart.findIndex(item => item.id === id);
    if (existingIndex > -1) {
      cart[existingIndex].qty += 1;
    } else {
      cart.push({ id, title, price, img, qty: 1 });
    }
    renderCart();
  }

  function updateQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
      item.qty += delta;
      if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== id);
      }
    }
    renderCart();
  }

  function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    renderCart();
  }

  function renderCart() {
    // Total count for badge
    const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
    if (cartCountBadge) {
      cartCountBadge.textContent = totalCount;
      cartCountBadge.style.transform = 'scale(1.3)';
      setTimeout(() => cartCountBadge.style.transform = 'scale(1)', 200);
    }

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="empty-cart-msg">
          <i class="fa-solid fa-plate-wheat gold-icon"></i>
          <p>Your culinary tray is empty.</p>
          <span class="sub">Select signature delicacies from our menu.</span>
        </div>
      `;
      if (cartSubtotalEl) cartSubtotalEl.textContent = '$0.00';
      if (cartGratuityEl) cartGratuityEl.textContent = '$0.00';
      if (cartTotalEl) cartTotalEl.textContent = '$0.00';
      return;
    }

    let itemsHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
      const itemTotal = item.price * item.qty;
      subtotal += itemTotal;
      itemsHTML += `
        <div class="cart-item">
          <div class="cart-item-img">
            <img src="${item.img}" alt="${item.title}">
          </div>
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.title}</h4>
            <span class="cart-item-price">$${item.price} each</span>
            <div class="cart-qty-ctrls mt-15">
              <button class="qty-btn" onclick="window.changeItemQty('${item.id}', -1)">-</button>
              <span class="qty-val">${item.qty}</span>
              <button class="qty-btn" onclick="window.changeItemQty('${item.id}', 1)">+</button>
            </div>
          </div>
          <button class="cart-remove-item" onclick="window.deleteItem('${item.id}')" title="Remove Item">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;
    });

    cartItemsContainer.innerHTML = itemsHTML;

    const gratuity = subtotal * 0.15;
    const grandTotal = subtotal + gratuity;

    if (cartSubtotalEl) cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (cartGratuityEl) cartGratuityEl.textContent = `$${gratuity.toFixed(2)}`;
    if (cartTotalEl) cartTotalEl.textContent = `$${grandTotal.toFixed(2)}`;
  }

  // Attach global helpers for inline cart buttons
  window.changeItemQty = (id, delta) => updateQty(id, delta);
  window.deleteItem = (id) => removeFromCart(id);

  // Checkout button simulation
  checkoutBtn?.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Your tray is empty! Please add culinary delights from the menu first.');
      return;
    }
    alert('Thank you for ordering with DEMO! Your private dining concierge has received your culinary selections.');
    cart = [];
    renderCart();
    closeCart();
  });

  // 10. Newsletter Form Submission
  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    if (input && input.value) {
      alert(`Honored to have you with us! We have sent our seasonal VIP degustation dispatch to ${input.value}`);
      input.value = '';
    }
  });

  // 11. Luxury Gold Confetti Animation Engine
  function triggerGoldConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiPieces = [];
    const colors = ['#d4af37', '#fff6d1', '#f6e69f', '#aa771c', '#ffffff', '#e5b95c'];

    for (let i = 0; i < 90; i++) {
      confettiPieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height * 0.5,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 3 + 2,
        speedX: (Math.random() - 0.5) * 3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8
      });
    }

    let animationFrame;
    const startTime = Date.now();

    function renderConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const elapsed = Date.now() - startTime;

      confettiPieces.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
        ctx.restore();
      });

      if (elapsed < 4000) {
        animationFrame = requestAnimationFrame(renderConfetti);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrame);
      }
    }

    renderConfetti();
  }
});
