/* ============================================================
   Pakistan Railways – Main JavaScript
   ============================================================ */

// ── Date Defaults ─────────────────────────────────────────────
function setDateDefaults() {
  const today = new Date();
  const fmt = (d) => d.toISOString().split('T')[0];
  const dateEl = document.getElementById('journeyDate');
  const retEl  = document.getElementById('returnDate');
  if (dateEl) dateEl.min = fmt(today);
  if (retEl)  retEl.min  = fmt(today);
}

// ── Trip Type Tabs ─────────────────────────────────────────────
function initTripTabs() {
  const tabs = document.querySelectorAll('.trip-tab');
  const returnCol = document.getElementById('returnDateCol');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected','true');
      if (returnCol) {
        returnCol.style.display = tab.dataset.tab === 'return' ? 'block' : 'none';
      }
    });
  });
}

// ── Station Swap ───────────────────────────────────────────────
function initStationSwap() {
  const btn  = document.getElementById('swapStations');
  const from = document.getElementById('fromStation');
  const to   = document.getElementById('toStation');
  if (!btn || !from || !to) return;
  btn.addEventListener('click', () => {
    const tmp = from.value;
    from.value = to.value;
    to.value = tmp;
    btn.style.transform = btn.style.transform === 'rotate(180deg)' ? '' : 'rotate(180deg)';
  });
}

// ── Search Form Validation ─────────────────────────────────────
function initSearchForm() {
  const form = document.getElementById('searchForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    const from = document.getElementById('fromStation')?.value;
    const to   = document.getElementById('toStation')?.value;
    const date = document.getElementById('journeyDate')?.value;

    if (!from || !to) {
      e.preventDefault();
      showToast('Please select both departure and destination stations.', 'warning');
      return;
    }
    if (from === to) {
      e.preventDefault();
      showToast('Departure and destination cannot be the same.', 'warning');
      return;
    }
    if (!date) {
      e.preventDefault();
      showToast('Please select a departure date.', 'warning');
      return;
    }
  });
}

// ── Live Departures Table ──────────────────────────────────────
const DEPARTURES = [
  { no: '14 DN', name: 'Karachi Express',    dest: 'Lahore Junction',   time: '08:00', plat: '1', status: 'ontime'   },
  { no: '1 DN',  name: 'Khyber Mail',        dest: 'Peshawar Cant.',    time: '08:30', plat: '3', status: 'delayed'  },
  { no: '25 DN', name: 'Tezgam Express',      dest: 'Rawalpindi',        time: '09:15', plat: '2', status: 'ontime'   },
  { no: '31 DN', name: 'Shalimar Express',    dest: 'Lahore Junction',   time: '10:00', plat: '4', status: 'arriving' },
  { no: '82 DN', name: 'Quetta Express',      dest: 'Quetta City',       time: '11:00', plat: '5', status: 'ontime'   },
  { no: '55 DN', name: 'Green Line Express',  dest: 'Lahore Junction',   time: '12:30', plat: '1', status: 'ontime'   },
  { no: '7 DN',  name: 'Allama Iqbal Express',dest: 'Faisalabad',        time: '14:00', plat: '2', status: 'delayed'  },
  { no: '41 DN', name: 'Awam Express',        dest: 'Multan Cantonment', time: '16:00', plat: '3', status: 'departed' },
];

const STATUS_MAP = {
  ontime:   { cls: 'status-ontime',   icon: 'fa-circle-check', label: 'On Time'  },
  delayed:  { cls: 'status-delayed',  icon: 'fa-clock',        label: 'Delayed'  },
  departed: { cls: 'status-departed', icon: 'fa-check',        label: 'Departed' },
  arriving: { cls: 'status-arriving', icon: 'fa-train',        label: 'Arriving' },
};

function renderDepartures() {
  const tbody = document.getElementById('departuresTableBody');
  if (!tbody) return;
  tbody.innerHTML = DEPARTURES.map(d => {
    const s = STATUS_MAP[d.status];
    return `<tr>
      <td><span class="train-no">${d.no}</span><div class="text-muted" style="font-size:.78rem">${d.name}</div></td>
      <td><i class="fa fa-location-dot me-1 text-green" style="font-size:.8rem"></i>${d.dest}</td>
      <td><strong>${d.time}</strong></td>
      <td><span class="badge rounded-pill" style="background:rgba(0,102,51,0.1);color:var(--pr-green);font-weight:600">Plt ${d.plat}</span></td>
      <td><span class="status-badge ${s.cls}"><i class="fa ${s.icon}"></i> ${s.label}</span></td>
    </tr>`;
  }).join('');
}

// ── PNR Check ──────────────────────────────────────────────────
function initPNRCheck() {
  const form = document.getElementById('pnrForm');
  const result = document.getElementById('pnrResult');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const pnr = document.getElementById('pnrInput')?.value.trim();
    if (!pnr) { showToast('Please enter a PNR number.', 'warning'); return; }

    if (result) {
      result.innerHTML = `<div class="alert alert-success d-flex align-items-start gap-3 mt-3">
        <i class="fa fa-check-circle fa-lg mt-1 text-success"></i>
        <div>
          <strong>PNR ${pnr} – Booking Confirmed</strong><br>
          <small>Train: 14 DN Karachi Express | Karachi → Lahore | 22 May 2026 | Seat: A12 | Class: Economy</small>
        </div>
      </div>`;
    }
  });
}

// ── Seat Selector ──────────────────────────────────────────────
function initSeatSelector() {
  const container = document.getElementById('seatGrid');
  if (!container) return;
  container.addEventListener('click', (e) => {
    const seat = e.target.closest('.seat.available');
    if (!seat) return;
    seat.classList.toggle('selected');
    const selected = container.querySelectorAll('.seat.selected').length;
    const counter = document.getElementById('seatCounter');
    if (counter) counter.textContent = `${selected} seat${selected !== 1 ? 's' : ''} selected`;
  });
}

// ── Class Selector ─────────────────────────────────────────────
function initClassSelector() {
  const cards = document.querySelectorAll('.class-select-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });
}

// ── Accessibility Panel ────────────────────────────────────────
function initA11yPanel() {
  const toggle    = document.getElementById('a11yToggle');
  const subPanel  = document.getElementById('a11ySubPanel');
  const hcBtn     = document.getElementById('highContrastBtn');
  const ltBtn     = document.getElementById('largeTextBtn');

  if (!toggle || !subPanel) return;

  toggle.addEventListener('click', () => {
    const open = subPanel.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });

  if (hcBtn) {
    hcBtn.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
      const pressed = document.body.classList.contains('high-contrast');
      hcBtn.setAttribute('aria-pressed', pressed);
      showToast(pressed ? 'High contrast mode enabled.' : 'High contrast mode disabled.', 'info');
    });
  }

  if (ltBtn) {
    ltBtn.addEventListener('click', () => {
      document.body.classList.toggle('large-text');
      const pressed = document.body.classList.contains('large-text');
      ltBtn.setAttribute('aria-pressed', pressed);
      showToast(pressed ? 'Large text mode enabled.' : 'Large text mode disabled.', 'info');
    });
  }
}

// ── Toast Notifications ────────────────────────────────────────
function showToast(msg, type = 'info') {
  const colors = { info: '#006633', warning: '#c8a000', error: '#dc3545', success: '#198754' };
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    Object.assign(container.style, {
      position: 'fixed', bottom: '5rem', right: '1.5rem',
      zIndex: '9999', display: 'flex', flexDirection: 'column', gap: '0.5rem',
    });
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.setAttribute('role', 'alert');
  toast.style.cssText = `
    background:white; border-left:4px solid ${colors[type] || colors.info};
    border-radius:8px; padding:.75rem 1rem; box-shadow:0 4px 20px rgba(0,0,0,.12);
    font-size:.875rem; max-width:320px; color:#2c3e2d;
    animation:fadeInUp .25s ease; opacity:1; transition:opacity .3s;
  `;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3500);
}

// ── Scroll Reveal (IntersectionObserver) ──────────────────────
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;
  const els = document.querySelectorAll('.service-card, .class-card, .news-card, .testimonial-card, .route-card, .stat-box');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.animation = 'fadeInUp .45s ease forwards';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => {
    el.style.opacity = '0';
    obs.observe(el);
  });
}

// ── Schedule Filter ────────────────────────────────────────────
function initScheduleFilter() {
  const filterForm = document.getElementById('scheduleFilterForm');
  if (!filterForm) return;
  filterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const from = filterForm.querySelector('#filterFrom')?.value;
    const to   = filterForm.querySelector('#filterTo')?.value;
    const cls  = filterForm.querySelector('#filterClass')?.value;
    renderScheduleResults(from, to, cls);
  });
  renderScheduleResults();
}

const TRAIN_DATA = [
  { no: '14 DN', name: 'Karachi Express',    from: 'khi', to: 'lhr', dep: '08:00', arr: '02:00+1', dur: '18h', cls: 'economy,sleeper,ac',         fare: 900  },
  { no: '25 DN', name: 'Tezgam Express',      from: 'khi', to: 'rwp', dep: '09:15', arr: '05:30+1', dur: '20h 15m', cls: 'economy,ac-sleeper,ac', fare: 1100 },
  { no: '1 DN',  name: 'Khyber Mail',        from: 'khi', to: 'psh', dep: '08:30', arr: '09:00+1', dur: '24h 30m', cls: 'economy,sleeper,ac',     fare: 1200 },
  { no: '55 DN', name: 'Green Line Express',  from: 'khi', to: 'lhr', dep: '12:30', arr: '06:30+1', dur: '18h',    cls: 'ac,ac-sleeper',          fare: 2500 },
  { no: '31 DN', name: 'Shalimar Express',    from: 'lhr', to: 'khi', dep: '14:00', arr: '08:00+1', dur: '18h',    cls: 'economy,sleeper',        fare: 900  },
  { no: '82 DN', name: 'Quetta Express',      from: 'khi', to: 'qta', dep: '11:00', arr: '07:00+1', dur: '20h',    cls: 'economy,sleeper,ac',    fare: 1000 },
  { no: '7 DN',  name: 'Allama Iqbal Express',from: 'khi', to: 'fsd', dep: '14:00', arr: '04:00+1', dur: '14h',    cls: 'economy',              fare: 750  },
  { no: '22 UP', name: 'Awam Express',        from: 'lhr', to: 'rwp', dep: '06:00', arr: '11:00',   dur: '5h',     cls: 'economy',              fare: 500  },
  { no: '10 UP', name: 'Subak Roo Express',   from: 'rwp', to: 'psh', dep: '07:00', arr: '10:00',   dur: '3h',     cls: 'economy,ac',           fare: 350  },
  { no: '41 DN', name: 'Zakaria Express',     from: 'lhr', to: 'mul', dep: '16:00', arr: '21:00',   dur: '5h',     cls: 'economy,sleeper',      fare: 650  },
  { no: '99 DN', name: 'Pak Business Express',from: 'lhr', to: 'khi', dep: '15:30', arr: '09:30+1', dur: '18h',    cls: 'economy,ac,ac-sleeper',  fare: 1500 },
  { no: '39 DN', name: 'Jaffer Express',      from: 'qta', to: 'psh', dep: '09:00', arr: '14:00+1', dur: '29h',    cls: 'economy,sleeper,ac',     fare: 1400 },
  { no: '42 DN', name: 'Karakoram Express',   from: 'lhr', to: 'khi', dep: '16:00', arr: '10:00+1', dur: '18h',    cls: 'economy,ac',             fare: 1200 },
  { no: '17 DN', name: 'Millat Express',      from: 'fsd', to: 'khi', dep: '17:10', arr: '11:10+1', dur: '18h',    cls: 'economy,sleeper,ac',     fare: 1000 },
  { no: '102 UP', name: 'Subak Raftar',       from: 'lhr', to: 'rwp', dep: '07:00', arr: '11:30',   dur: '4h 30m', cls: 'economy,ac',             fare: 600 },
  { no: '11 DN', name: 'Hazara Express',      from: 'khi', to: 'rwp', dep: '05:50', arr: '03:50+1', dur: '22h',    cls: 'economy,sleeper',        fare: 950 },
];

function renderScheduleResults(from = '', to = '', cls = '') {
  const container = document.getElementById('scheduleResults');
  if (!container) return;
  let filtered = TRAIN_DATA;
  if (from) filtered = filtered.filter(t => !from || t.from === from || t.to === from);
  if (to)   filtered = filtered.filter(t => !to   || t.to === to   || t.from === to);
  if (cls && cls !== 'any') filtered = filtered.filter(t => t.cls.includes(cls));

  if (!filtered.length) {
    container.innerHTML = `<div class="alert alert-warning"><i class="fa fa-info-circle me-2"></i>No trains found for the selected criteria. Please adjust your filters.</div>`;
    return;
  }

  container.innerHTML = filtered.map(t => `
    <div class="train-result-card">
      <div class="train-result-header">
        <div class="d-flex align-items-center gap-2">
          <span class="train-no">${t.no}</span>
          <strong style="font-size:.9rem">${t.name}</strong>
        </div>
        <span class="status-badge status-ontime"><i class="fa fa-circle-check"></i> Available</span>
      </div>
      <div class="train-result-body">
        <div class="d-flex align-items-center gap-2">
          <div class="text-center">
            <div class="time-display">${t.dep}</div>
            <div class="time-station">${t.from.toUpperCase()}</div>
          </div>
          <div class="duration-line flex-fill">
            <div class="duration-dashes flex-fill"></div>
            <div class="duration-label">${t.dur}</div>
          </div>
          <div class="text-center">
            <div class="time-display">${t.arr}</div>
            <div class="time-station">${t.to.toUpperCase()}</div>
          </div>
          <div class="ms-auto text-end">
            <div class="class-price">From <strong>Rs ${t.fare.toLocaleString()}</strong></div>
            <a href="booking.html?train=${t.no}" class="btn-pr-primary mt-2 py-2 px-3" style="font-size:.8rem">
              <i class="fa fa-ticket-alt"></i> Book
            </a>
          </div>
        </div>
        <div class="mt-2 d-flex gap-2 flex-wrap">
          ${t.cls.split(',').map(c => `<span class="badge" style="background:rgba(0,102,51,.08);color:var(--pr-green);font-weight:600;font-size:.72rem">${c.replace('-',' ').replace(/\b\w/g,l=>l.toUpperCase())}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

// ── Contact Form ───────────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.classList.add('was-validated'); return; }
    const btn = form.querySelector('[type="submit"]');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin me-2"></i>Sending...'; }
    setTimeout(() => {
      form.reset();
      form.classList.remove('was-validated');
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa fa-paper-plane me-2"></i>Send Message'; }
      const result = document.getElementById('contactResult');
      if (result) {
        result.innerHTML = `<div class="alert alert-success"><i class="fa fa-check-circle me-2"></i>Thank you! Your message has been received. We will respond within 24 hours.</div>`;
        result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 1500);
  });
}

// ── Cancel Form ────────────────────────────────────────────────
function initCancelForm() {
  const form = document.getElementById('cancelForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const pnr = document.getElementById('cancelPNR')?.value.trim();
    if (!pnr) { showToast('Please enter your PNR number.', 'warning'); return; }
    const result = document.getElementById('cancelResult');
    if (result) {
      result.innerHTML = `<div class="alert alert-warning d-flex gap-3">
        <i class="fa fa-exclamation-triangle fa-lg mt-1"></i>
        <div>
          <strong>Confirm Cancellation – PNR ${pnr}</strong><br>
          <small>Train: 14 DN Karachi Express | 22 May 2026 | Refund: Rs 810 (90%) within 72 hrs</small><br>
          <button class="btn btn-sm btn-danger mt-2" onclick="confirmCancel()">Confirm Cancellation</button>
          <button class="btn btn-sm btn-outline-secondary mt-2 ms-2" onclick="document.getElementById('cancelResult').innerHTML=''">Cancel</button>
        </div>
      </div>`;
    }
  });
}

window.confirmCancel = function() {
  const result = document.getElementById('cancelResult');
  if (result) {
    result.innerHTML = `<div class="alert alert-success"><i class="fa fa-check-circle me-2"></i>Ticket cancelled successfully. Refund of Rs 810 will be processed within 72 hours to your original payment method.</div>`;
  }
};

// ── Booking Steps ──────────────────────────────────────────────
function initBookingSteps() {
  const steps = document.querySelectorAll('.booking-step');
  const panels = document.querySelectorAll('.booking-panel');

  function goToStep(n) {
    steps.forEach((s, i) => {
      s.classList.remove('active', 'done');
      if (i < n)  s.classList.add('done');
      if (i === n) s.classList.add('active');
    });
    panels.forEach((p, i) => {
      p.style.display = i === n ? 'block' : 'none';
    });
  }

  document.querySelectorAll('[data-next-step]').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = parseInt(btn.closest('.booking-panel')?.dataset.step || '0');
      goToStep(current + 1);
      window.scrollTo({ top: document.querySelector('.booking-stepper')?.offsetTop - 80 || 0, behavior: 'smooth' });
    });
  });

  document.querySelectorAll('[data-prev-step]').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = parseInt(btn.closest('.booking-panel')?.dataset.step || '1');
      goToStep(current - 1);
    });
  });
}

// ── Smooth Anchor Scroll ───────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.focus?.({ preventScroll: true });
      }
    });
  });
}

// ── Keyboard Navigation for Cards ─────────────────────────────
function initKeyboardNav() {
  document.querySelectorAll('.service-card[tabindex], .class-card[tabindex]').forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const link = card.querySelector('a');
        if (link) link.click();
      }
    });
  });
}

// ── Live Clock ─────────────────────────────────────────────────
function initLiveClock() {
  const clocks = document.querySelectorAll('.live-clock');
  if (!clocks.length) return;
  function update() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-PK', { timeZone: 'Asia/Karachi', hour: '2-digit', minute: '2-digit' });
    clocks.forEach(c => c.textContent = time + ' PKT');
  }
  update();
  setInterval(update, 30000);
}

// ── Bootstrap Tooltips ─────────────────────────────────────────
function initTooltips() {
  const els = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  els.forEach(el => new bootstrap.Tooltip(el));
}

// ── Navbar scroll effect ───────────────────────────────────────
function initNavScroll() {
  const nav = document.querySelector('.main-navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 10
      ? '0 4px 20px rgba(0,0,0,0.25)'
      : '0 2px 12px rgba(0,0,0,0.2)';
  }, { passive: true });
}

// ── Init ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setDateDefaults();
  initTripTabs();
  initStationSwap();
  initSearchForm();
  renderDepartures();
  initPNRCheck();
  initSeatSelector();
  initClassSelector();
  initA11yPanel();
  initScrollReveal();
  initScheduleFilter();
  initContactForm();
  initCancelForm();
  initBookingSteps();
  initSmoothScroll();
  initKeyboardNav();
  initLiveClock();
  initTooltips();
  initNavScroll();

  // Parse URL params and pre-fill search
  const params = new URLSearchParams(window.location.search);
  if (params.get('from')) {
    const sel = document.getElementById('fromStation') || document.getElementById('filterFrom');
    if (sel) sel.value = params.get('from');
  }
  if (params.get('to')) {
    const sel = document.getElementById('toStation') || document.getElementById('filterTo');
    if (sel) sel.value = params.get('to');
  }
  if (params.get('from') || params.get('to')) {
    renderScheduleResults(params.get('from') || '', params.get('to') || '');
  }
});
