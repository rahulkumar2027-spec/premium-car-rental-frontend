(function() {
  // ============ CAR DATA ============
  const carsData = [
    { id: 1, brand: 'BMW', model: '5 Series M Sport', price: 180, rating: 4.9, fuel: 'Diesel', transmission: 'Automatic', seats: 5,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80','https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80'],
      available: true, features: ['Leather Seats','Sunroof','Navigation','Bluetooth','Parking Sensors'], description: 'Luxury sedan with exceptional performance.' },
    { id: 2, brand: 'Mercedes', model: 'GLE Coupe', price: 220, rating: 4.8, fuel: 'Petrol', transmission: 'Automatic', seats: 5,
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80'], available: true,
      features: ['4MATIC AWD','Panoramic Roof','MBUX System','Heated Seats','360 Camera'], description: 'Stylish SUV coupe.' },
    { id: 3, brand: 'Audi', model: 'Q7 Quattro', price: 200, rating: 4.7, fuel: 'Diesel', transmission: 'Automatic', seats: 7,
      image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80'], available: true,
      features: ['Quattro AWD','7 Seats','Virtual Cockpit','Air Suspension','Bang & Olufsen'], description: 'Spacious 7‑seater SUV.' },
    { id: 4, brand: 'Tesla', model: 'Model 3 Long Range', price: 160, rating: 4.9, fuel: 'Electric', transmission: 'Automatic', seats: 5,
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80'], available: true,
      features: ['Autopilot','0-60 in 4.2s','358mi Range','Glass Roof'], description: 'All‑electric performance.' },
    { id: 5, brand: 'Toyota', model: 'RAV4 Hybrid', price: 95, rating: 4.6, fuel: 'Hybrid', transmission: 'Automatic', seats: 5,
      image: 'https://images.unsplash.com/photo-1629897048514-3dd7414fe72a?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1629897048514-3dd7414fe72a?w=800&q=80'], available: true,
      features: ['Hybrid Engine','AWD','Apple CarPlay'], description: 'Fuel‑efficient hybrid SUV.' },
    { id: 6, brand: 'Honda', model: 'Civic Sport', price: 75, rating: 4.5, fuel: 'Petrol', transmission: 'Manual', seats: 5,
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80'], available: false,
      features: ['Sport Mode','6‑Speed Manual','Sunroof'], description: 'Sporty compact car.' },
  ];

  // ============ STATE ============
  let wishlist = JSON.parse(localStorage.getItem('drivelux_wishlist') || '[]');
  let bookings = JSON.parse(localStorage.getItem('drivelux_bookings') || '[]');
  let darkMode = localStorage.getItem('drivelux_darkmode') === 'true';
  let currentCarId = null;

  // ============ DOM ELEMENTS ============
  const $loading = document.getElementById('loading-screen');
  const $toastContainer = document.getElementById('toast-container');
  const $scrollTop = document.getElementById('scroll-top');
  const $navLinks = document.getElementById('navLinks');
  const $hamburger = document.getElementById('hamburger');
  const $themeToggle = document.getElementById('themeToggle');
  const $wishlistBadge = document.getElementById('wishlistBadge');
  const $wishlistCountNav = document.getElementById('wishlistCountNav');
  const allPages = document.querySelectorAll('.page');
  const allNavLinks = document.querySelectorAll('[data-nav]');

  // ============ UTILITIES ============
  function toast(msg, type = 'info') {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = msg;
    $toastContainer.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }

  function saveData() {
    localStorage.setItem('drivelux_wishlist', JSON.stringify(wishlist));
    localStorage.setItem('drivelux_bookings', JSON.stringify(bookings));
    localStorage.setItem('drivelux_darkmode', darkMode.toString());
  }

  function updateWishlistUI() {
    const count = wishlist.length;
    $wishlistBadge.style.display = count ? 'block' : 'none';
    $wishlistCountNav.style.display = count ? 'inline' : 'none';
    $wishlistCountNav.textContent = count;
    document.querySelectorAll('.car-card-wishlist').forEach(btn => {
      const cid = parseInt(btn.dataset.carId);
      btn.classList.toggle('active', wishlist.includes(cid));
    });
  }

  // ============ ROUTING ============
  function navigateTo(pageName, param = null) {
    allPages.forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`page-${pageName}`) || document.getElementById('page-404');
    target.classList.add('active');
    allNavLinks.forEach(a => a.classList.remove('active'));
    const navMatch = document.querySelector(`[data-nav="${pageName}"]`);
    if (navMatch) navMatch.classList.add('active');
    $navLinks.classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderDynamicContent();
    if (window.location.hash !== `#/${pageName}${param ? '/' + param : ''}`) {
      history.pushState(null, null, `#/${pageName}${param ? '/' + param : ''}`);
    }
  }

  function handleRoute() {
    const hash = location.hash.replace('#/', '') || 'home';
    const [page, param] = hash.split('/');
    if (page === 'details' && param) { currentCarId = parseInt(param); navigateTo('details', param); }
    else if (page === 'booking' && param) { currentCarId = parseInt(param); navigateTo('booking', param); }
    else if (['home','cars','about','contact','wishlist','bookings','login','register'].includes(page)) { navigateTo(page); }
    else { navigateTo('404'); }
  }

  window.addEventListener('hashchange', handleRoute);

  // ============ RENDER DYNAMIC CONTENT ============
  function renderDynamicContent() {
    const activePage = document.querySelector('.page.active').id;
    if (activePage === 'page-home') renderFeaturedCars();
    if (activePage === 'page-cars') renderCarsPage();
    if (activePage === 'page-wishlist') renderWishlistPage();
    if (activePage === 'page-bookings') renderBookingsPage();
    if (activePage === 'page-details' && currentCarId) renderCarDetails(currentCarId);
    if (activePage === 'page-booking' && currentCarId) renderBookingPage(currentCarId);
  }

  // ============ CAR CARD HTML GENERATOR ============
  function createCarCard(car) {
    const isWishlisted = wishlist.includes(car.id);
    return `
    <div class="car-card">
      <div class="car-card-img">
        <img src="${car.image}" alt="${car.brand} ${car.model}">
        <span class="car-card-badge ${car.available ? '' : 'unavailable'}">${car.available ? 'Available' : 'Booked'}</span>
        <button class="car-card-wishlist ${isWishlisted ? 'active' : ''}" data-car-id="${car.id}">
          <i class="fa-${isWishlisted ? 'solid' : 'regular'} fa-heart"></i>
        </button>
      </div>
      <div class="car-card-body">
        <span class="brand">${car.brand}</span>
        <h3 class="model">${car.model}</h3>
        <div class="car-card-specs">
          <span><i class="fa-solid fa-gas-pump"></i> ${car.fuel}</span>
          <span><i class="fa-solid fa-cog"></i> ${car.transmission}</span>
          <span><i class="fa-solid fa-user"></i> ${car.seats} Seats</span>
        </div>
        <div class="car-card-footer">
          <span class="price">$${car.price}<small>/day</small></span>
          <span class="rating"><i class="fa-solid fa-star"></i> ${car.rating}</span>
        </div>
        <div style="display:flex; gap:8px; margin-top:10px;">
          <a href="#/details/${car.id}" class="btn btn-sm btn-outline">Details</a>
          <a href="#/booking/${car.id}" class="btn btn-sm btn-primary" ${!car.available ? 'style="opacity:0.5;pointer-events:none;"' : ''}>Book Now</a>
        </div>
      </div>
    </div>`;
  }

  function attachWishlistEvents() {
    document.querySelectorAll('.car-card-wishlist').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const carId = parseInt(btn.dataset.carId);
        toggleWishlist(carId);
      });
    });
  }

  function toggleWishlist(carId) {
    const idx = wishlist.indexOf(carId);
    if (idx > -1) { wishlist.splice(idx, 1); toast('Removed from wishlist', 'info'); }
    else { wishlist.push(carId); toast('Added to wishlist!', 'success'); }
    saveData();
    updateWishlistUI();
    renderDynamicContent();
  }

  // ============ FEATURED CARS ============
  function renderFeaturedCars() {
    const grid = document.getElementById('featuredCarsGrid');
    if (!grid) return;
    const featured = carsData.filter(c => c.available).slice(0, 6);
    grid.innerHTML = featured.map(createCarCard).join('');
    attachWishlistEvents();
  }

  // ============ CARS PAGE ============
  function renderCarsPage() {
    const grid = document.getElementById('allCarsGrid');
    if (!grid) return;
    populateFilters();
    const search = (document.getElementById('carsSearchBar')?.value || '').toLowerCase();
    const brand = document.getElementById('carsFilterBrand')?.value || '';
    const fuel = document.getElementById('carsFilterFuel')?.value || '';
    const trans = document.getElementById('carsFilterTransmission')?.value || '';
    const seats = document.getElementById('carsFilterSeats')?.value || '';
    const sort = document.getElementById('carsSortBy')?.value || '';

    let filtered = carsData.filter(c => {
      if (search && !`${c.brand} ${c.model}`.toLowerCase().includes(search)) return false;
      if (brand && c.brand !== brand) return false;
      if (fuel && c.fuel !== fuel) return false;
      if (trans && c.transmission !== trans) return false;
      if (seats && c.seats !== parseInt(seats)) return false;
      return true;
    });

    if (sort === 'price-asc') filtered.sort((a,b) => a.price - b.price);
    if (sort === 'price-desc') filtered.sort((a,b) => b.price - a.price);
    if (sort === 'rating-desc') filtered.sort((a,b) => b.rating - a.rating);

    grid.innerHTML = filtered.length ? filtered.map(createCarCard).join('') : '<p style="grid-column:1/-1;text-align:center;">No cars found.</p>';
    attachWishlistEvents();
  }

  function populateFilters() {
    const brands = [...new Set(carsData.map(c => c.brand))];
    const fuels = [...new Set(carsData.map(c => c.fuel))];
    const trans = [...new Set(carsData.map(c => c.transmission))];
    const seats = [...new Set(carsData.map(c => c.seats))].sort((a,b) => a-b);

    const fill = (id, options, def = 'All') => {
      const sel = document.getElementById(id);
      if (!sel || sel.options.length > 1) return;
      sel.innerHTML = `<option value="">${def}</option>` + options.map(o => `<option value="${o}">${o}</option>`).join('');
    };
    fill('carsFilterBrand', brands, 'All Brands');
    fill('carsFilterFuel', fuels, 'All Fuel');
    fill('carsFilterTransmission', trans, 'All Transmission');
    fill('carsFilterSeats', seats, 'All Seats');
    fill('homeSearchBrand', brands, 'All Brands');
    fill('homeSearchFuel', fuels, 'All Fuel');
  }

  // ============ WISHLIST PAGE ============
  function renderWishlistPage() {
    const grid = document.getElementById('wishlistGrid');
    const emptyMsg = document.getElementById('wishlistEmpty');
    if (!grid) return;
    const wishlistCars = carsData.filter(c => wishlist.includes(c.id));
    grid.innerHTML = wishlistCars.map(createCarCard).join('');
    emptyMsg.style.display = wishlistCars.length ? 'none' : 'block';
    attachWishlistEvents();
  }

  // ============ BOOKINGS PAGE ============
  function renderBookingsPage() {
    const list = document.getElementById('bookingsList');
    const emptyMsg = document.getElementById('bookingsEmpty');
    const clearBtn = document.getElementById('clearBookingsBtn');
    if (!list) return;
    if (bookings.length === 0) {
      list.innerHTML = '';
      emptyMsg.style.display = 'block';
      clearBtn.style.display = 'none';
      return;
    }
    emptyMsg.style.display = 'none';
    clearBtn.style.display = 'inline-block';
    list.innerHTML = bookings.map((b, i) => `
      <div class="booking-card">
        <h3>${b.carName}</h3>
        <p><strong>Pickup:</strong> ${b.pickupLocation} | ${b.pickupDate}</p>
        <p><strong>Return:</strong> ${b.dropoffLocation} | ${b.returnDate}</p>
        <p><strong>Total:</strong> $${b.grandTotal} | <strong>Days:</strong> ${b.days}</p>
        <button class="btn btn-sm btn-danger cancel-booking" data-index="${i}">Cancel</button>
      </div>
    `).join('');
    document.querySelectorAll('.cancel-booking').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index);
        bookings.splice(idx, 1);
        saveData();
        renderBookingsPage();
        toast('Booking cancelled', 'warning');
      });
    });
  }

  // ============ CAR DETAILS PAGE ============
  function renderCarDetails(carId) {
    const container = document.getElementById('carDetailsContent');
    if (!container) return;
    const car = carsData.find(c => c.id === carId);
    if (!car) { navigateTo('404'); return; }
    container.innerHTML = `
      <div class="details-grid">
        <div>
          <div class="slider-container" id="detailSlider">
            <div class="slider-track">${car.images.map(img => `<div class="slider-slide"><img src="${img}" alt=""></div>`).join('')}</div>
            <button class="slider-btn prev"><i class="fa-solid fa-chevron-left"></i></button>
            <button class="slider-btn next"><i class="fa-solid fa-chevron-right"></i></button>
            <div class="slider-dots">${car.images.map((_,i) => `<span class="slider-dot ${i===0?'active':''}" data-index="${i}"></span>`).join('')}</div>
          </div>
        </div>
        <div>
          <span class="brand">${car.brand}</span>
          <h2>${car.model}</h2>
          <p>${car.description}</p>
          <div class="rating"><i class="fa-solid fa-star"></i> ${car.rating} / 5.0</div>
          <p class="price">$${car.price}<small>/day</small></p>
          <div class="spec-tags">
            <span><i class="fa-solid fa-gas-pump"></i> ${car.fuel}</span>
            <span><i class="fa-solid fa-cog"></i> ${car.transmission}</span>
            <span><i class="fa-solid fa-user"></i> ${car.seats} Seats</span>
          </div>
          <h4>Features</h4>
          <ul class="features-list">${car.features.map(f => `<li>${f}</li>`).join('')}</ul>
          <a href="#/booking/${car.id}" class="btn btn-primary btn-block" ${!car.available ? 'disabled style="opacity:0.5;"' : ''}>Book Now</a>
        </div>
      </div>
    `;
    initSlider(car.images.length);
  }

  function initSlider(total) {
    let current = 0;
    const track = document.querySelector('#detailSlider .slider-track');
    const dots = document.querySelectorAll('#detailSlider .slider-dot');
    const update = () => { track.style.transform = `translateX(-${current * 100}%)`; dots.forEach((d,i) => d.classList.toggle('active', i === current)); };
    document.querySelector('#detailSlider .prev').addEventListener('click', () => { current = (current - 1 + total) % total; update(); });
    document.querySelector('#detailSlider .next').addEventListener('click', () => { current = (current + 1) % total; update(); });
    dots.forEach(d => d.addEventListener('click', () => { current = parseInt(d.dataset.index); update(); }));
  }

  // ============ BOOKING PAGE ============
  function renderBookingPage(carId) {
    const container = document.getElementById('bookingContent');
    if (!container) return;
    const car = carsData.find(c => c.id === carId);
    if (!car) { navigateTo('404'); return; }
    container.innerHTML = `
      <h2>Book ${car.brand} ${car.model}</h2>
      <p>$${car.price}/day</p>
      <form id="bookingForm" class="booking-form" novalidate>
        <div class="form-row">
          <div class="form-group"><label>Pickup Location</label><input type="text" id="bPickupLoc" required></div>
          <div class="form-group"><label>Drop-off Location</label><input type="text" id="bDropoffLoc" required></div>
          <div class="form-group"><label>Pickup Date</label><input type="date" id="bPickupDate" required></div>
          <div class="form-group"><label>Return Date</label><input type="date" id="bReturnDate" required></div>
        </div>
        <div class="extras">
          <label><input type="checkbox" id="bInsurance" data-price="25"> Insurance (+$25/day)</label>
          <label><input type="checkbox" id="bGPS" data-price="10"> GPS (+$10/day)</label>
          <label><input type="checkbox" id="bChildSeat" data-price="15"> Child Seat (+$15/day)</label>
        </div>
        <div class="booking-summary" id="bookingSummaryCalc">
          <h4>Booking Summary</h4>
          <div class="summary-row"><span>Base Price</span><span id="sumBase">-</span></div>
          <div class="summary-row"><span>Extras</span><span id="sumExtras">-</span></div>
          <div class="summary-row"><span>Tax (10%)</span><span id="sumTax">-</span></div>
          <div class="summary-row"><span>Discount (5% for 5+ days)</span><span id="sumDiscount">-</span></div>
          <div class="summary-row total"><span>Grand Total</span><span id="sumTotal">-</span></div>
        </div>
        <button type="submit" class="btn btn-primary btn-block">Confirm Booking</button>
      </form>
    `;

    const calc = () => {
      const pDate = new Date(document.getElementById('bPickupDate').value);
      const rDate = new Date(document.getElementById('bReturnDate').value);
      if (isNaN(pDate) || isNaN(rDate) || rDate <= pDate) return;
      const days = Math.max(1, Math.ceil((rDate - pDate) / (1000*60*60*24)));
      const base = car.price * days;
      let extras = 0;
      if (document.getElementById('bInsurance').checked) extras += 25 * days;
      if (document.getElementById('bGPS').checked) extras += 10 * days;
      if (document.getElementById('bChildSeat').checked) extras += 15 * days;
      const subtotal = base + extras;
      const tax = subtotal * 0.1;
      const discount = days >= 5 ? subtotal * 0.05 : 0;
      const grandTotal = subtotal + tax - discount;
      document.getElementById('sumBase').textContent = `$${base.toFixed(2)}`;
      document.getElementById('sumExtras').textContent = `$${extras.toFixed(2)}`;
      document.getElementById('sumTax').textContent = `$${tax.toFixed(2)}`;
      document.getElementById('sumDiscount').textContent = `-$${discount.toFixed(2)}`;
      document.getElementById('sumTotal').textContent = `$${grandTotal.toFixed(2)}`;
    };
    document.querySelectorAll('#bPickupDate, #bReturnDate, #bInsurance, #bGPS, #bChildSeat').forEach(el => el.addEventListener('change', calc));

    document.getElementById('bookingForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const pLoc = document.getElementById('bPickupLoc').value.trim();
      const dLoc = document.getElementById('bDropoffLoc').value.trim();
      const pDate = document.getElementById('bPickupDate').value;
      const rDate = document.getElementById('bReturnDate').value;
      if (!pLoc || !dLoc || !pDate || !rDate) { toast('Please fill all fields', 'error'); return; }
      const days = Math.ceil((new Date(rDate) - new Date(pDate)) / (1000*60*60*24));
      if (days <= 0) { toast('Invalid dates', 'error'); return; }
      const base = car.price * days;
      let extras = 0;
      if (document.getElementById('bInsurance').checked) extras += 25 * days;
      if (document.getElementById('bGPS').checked) extras += 10 * days;
      if (document.getElementById('bChildSeat').checked) extras += 15 * days;
      const subtotal = base + extras;
      const tax = subtotal * 0.1;
      const discount = days >= 5 ? subtotal * 0.05 : 0;
      const grandTotal = (subtotal + tax - discount).toFixed(2);

      bookings.push({
        carId: car.id, carName: `${car.brand} ${car.model}`,
        pickupLocation: pLoc, dropoffLocation: dLoc,
        pickupDate: pDate, returnDate: rDate,
        days, basePrice: base, extras, tax, discount, grandTotal
      });
      saveData();
      toast('Booking confirmed!', 'success');
      navigateTo('bookings');
    });
  }

  // ============ FAQ ACCORDION ============
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      item.classList.toggle('open');
    });
  });

  // ============ COUNTER ANIMATION ============
  function animateCounters() {
    document.querySelectorAll('.count[data-target]').forEach(counter => {
      const target = +counter.dataset.target;
      const duration = 2000;
      const start = performance.now();
      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        counter.textContent = Math.floor(target * (1 - Math.pow(1 - progress, 3)));
        if (progress < 1) requestAnimationFrame(update);
        else counter.textContent = target;
      }
      requestAnimationFrame(update);
    });
  }
  const counterObserver = new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting) { animateCounters(); obs.disconnect(); }
  }, { threshold: 0.3 });
  const counterSection = document.querySelector('.counter-grid');
  if (counterSection) counterObserver.observe(counterSection);

  // ============ THEME TOGGLE ============
  $themeToggle.addEventListener('click', () => {
    darkMode = !darkMode;
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : '');
    saveData();
  });

  // ============ SCROLL TO TOP ============
  window.addEventListener('scroll', () => {
    $scrollTop.classList.toggle('visible', window.scrollY > 500);
  });
  $scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ============ HAMBURGER MENU ============
  $hamburger.addEventListener('click', () => $navLinks.classList.toggle('open'));

  // ============ PASSWORD TOGGLE ============
  document.addEventListener('click', (e) => {
    if (e.target.closest('.toggle-password')) {
      const btn = e.target.closest('.toggle-password');
      const input = btn.parentElement.querySelector('input');
      const icon = btn.querySelector('i');
      if (input.type === 'password') { input.type = 'text'; icon.classList.replace('fa-eye', 'fa-eye-slash'); }
      else { input.type = 'password'; icon.classList.replace('fa-eye-slash', 'fa-eye'); }
    }
  });

  // ============ PASSWORD STRENGTH ============
  document.getElementById('regPassword')?.addEventListener('input', function() {
    const strength = document.getElementById('passwordStrength');
    const val = this.value;
    if (val.length < 4) strength.className = 'password-strength weak';
    else if (val.length < 8) strength.className = 'password-strength medium';
    else strength.className = 'password-strength strong';
  });

  // ============ FORM SUBMISSIONS ============
  document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    if (!email || !password) { toast('Please fill all fields', 'error'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { toast('Invalid email', 'error'); return; }
    if (document.getElementById('rememberMe').checked) localStorage.setItem('drivelux_remembered_email', email);
    toast('Login successful!', 'success');
    setTimeout(() => navigateTo('home'), 800);
  });

  document.getElementById('registerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirmPassword').value;
    if (!name || !email || !phone || !password || !confirm) { toast('All fields required', 'error'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { toast('Invalid email', 'error'); return; }
    if (password.length < 6) { toast('Password too short (min 6)', 'error'); return; }
    if (password !== confirm) { toast('Passwords do not match', 'error'); return; }
    toast('Account created!', 'success');
    setTimeout(() => navigateTo('home'), 800);
  });

  document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    toast('Message sent! We will get back to you soon.', 'success');
    this.reset();
  });

  document.getElementById('newsletterBtn')?.addEventListener('click', () => {
    const input = document.getElementById('newsletterEmail');
    if (input?.value && /\S+@\S+\.\S+/.test(input.value)) {
      toast('Subscribed!', 'success');
      input.value = '';
    } else toast('Valid email required', 'error');
  });

  // Home search button
  document.getElementById('homeSearchBtn')?.addEventListener('click', () => {
    const brand = document.getElementById('homeSearchBrand').value;
    const fuel = document.getElementById('homeSearchFuel').value;
    const price = document.getElementById('homeSearchPrice').value;
    navigateTo('cars');
    setTimeout(() => {
      if (brand) document.getElementById('carsFilterBrand').value = brand;
      if (fuel) document.getElementById('carsFilterFuel').value = fuel;
      if (price) document.getElementById('carsSearchBar').value = '';
      renderCarsPage();
      if (price) {
        document.querySelectorAll('#allCarsGrid .car-card').forEach(card => {
          const priceEl = card.querySelector('.price');
          if (priceEl && parseFloat(priceEl.textContent.replace('$','')) > parseFloat(price)) card.style.display = 'none';
        });
      }
    }, 400);
  });

  // Cars page filter listeners
  ['carsSearchBar','carsFilterBrand','carsFilterFuel','carsFilterTransmission','carsFilterSeats','carsSortBy'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', renderCarsPage);
    document.getElementById(id)?.addEventListener('change', renderCarsPage);
  });

  document.getElementById('clearBookingsBtn')?.addEventListener('click', () => {
    if (confirm('Clear all bookings?')) { bookings = []; saveData(); renderBookingsPage(); toast('Bookings cleared', 'info'); }
  });

  // ============ INITIALIZATION ============
  function init() {
    if (darkMode) document.documentElement.setAttribute('data-theme', 'dark');
    setTimeout(() => $loading.classList.add('hidden'), 600);
    handleRoute();
    updateWishlistUI();
    const remembered = localStorage.getItem('drivelux_remembered_email');
    if (remembered && document.getElementById('loginEmail')) document.getElementById('loginEmail').value = remembered;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();