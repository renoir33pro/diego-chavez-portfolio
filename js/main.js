/**
 * DIEGO CHÁVEZ — PORTFOLIO & CATALOG JAVASCRIPT
 * Interactive Features, Metrics Animations & WhatsApp Quote Generator
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileMenu();
  initHeaderScroll();
  initMetricCounters();
  initFolderModals();
  initProjectTabs();
  initReelModals();
  initQuoteCalculator();
});

/* ==========================================================================
   1. THEME TOGGLE (Dark / Light Mode)
   ========================================================================== */
function initThemeToggle() {
  const themeButtons = document.querySelectorAll('.theme-toggle-btn');
  
  function getStoredTheme() {
    try {
      return localStorage.getItem('dc_portfolio_theme') || 'dark';
    } catch (e) {
      return 'dark';
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem('dc_portfolio_theme', theme);
    } catch (e) {}
  }

  const storedTheme = getStoredTheme();
  applyTheme(storedTheme);

  let isLock = false;
  function triggerThemeToggle(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isLock) return;
    isLock = true;
    setTimeout(() => { isLock = false; }, 280);

    const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    setStoredTheme(nextTheme);
  }

  themeButtons.forEach(btn => {
    // Immediate 0ms response on mobile phones
    btn.addEventListener('touchend', triggerThemeToggle, { passive: false });
    // Standard click for desktop mouse and accessibility
    btn.addEventListener('click', triggerThemeToggle);
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
      if (document.body) document.body.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
      if (document.body) document.body.classList.remove('light-theme');
    }

    const icons = document.querySelectorAll('.theme-icon-container, #themeIcon');
    icons.forEach(icon => {
      if (theme === 'dark') {
        // Sun icon (click to switch to light)
        icon.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>`;
      } else {
        // Moon icon (click to switch to dark)
        icon.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>`;
      }
    });

    const statusTexts = document.querySelectorAll('.theme-text-status');
    statusTexts.forEach(txt => {
      txt.textContent = theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro';
    });
  }
}

/* ==========================================================================
   2. MOBILE MENU & HEADER SCROLL
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('mobileDrawerClose');
  const navOverlay = document.getElementById('navOverlay');
  const drawerLinks = document.querySelectorAll('.mobile-drawer-link');

  function openDrawer(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (drawer) drawer.classList.add('open');
    if (menuBtn) menuBtn.classList.add('active');
    if (navOverlay) navOverlay.classList.add('active');
    document.body.classList.add('menu-open');
    document.documentElement.classList.add('menu-open');
    lockBodyScroll();
  }

  function closeDrawer(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (drawer) drawer.classList.remove('open');
    if (menuBtn) menuBtn.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
    document.body.classList.remove('menu-open');
    document.documentElement.classList.remove('menu-open');
    const remainingModal = document.querySelector('.modal-overlay.active');
    if (!remainingModal) {
      unlockBodyScroll();
    }
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
      if (drawer && drawer.classList.contains('open')) {
        closeDrawer(e);
      } else {
        openDrawer(e);
      }
    });
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeDrawer);
    navOverlay.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   3. ANIMATED METRICS COUNTER
   ========================================================================== */
function initMetricCounters() {
  const counters = document.querySelectorAll('[data-counter-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-counter-target'));
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        const duration = 2000;
        let startTimestamp = null;

        function step(timestamp) {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          // EaseOutQuart curve
          const easeProgress = 1 - Math.pow(1 - progress, 4);
          const currentVal = easeProgress * target;
          
          el.innerText = prefix + (decimals > 0 ? currentVal.toFixed(decimals) : Math.floor(currentVal).toLocaleString()) + suffix;
          
          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            el.innerText = prefix + (decimals > 0 ? target.toFixed(decimals) : target.toLocaleString()) + suffix;
          }
        }

        window.requestAnimationFrame(step);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => observer.observe(c));
}

/* ==========================================================================
   4. SERVICES FOLDER MODALS
   ========================================================================== */
const serviceData = {
  estrategia: {
    title: "Estrategia Digital & Posicionamiento",
    badge: "Fase 01 — Fundamentos",
    description: "Diseño de un ecosistema estratégico basado en datos, análisis competitivo y arquetipo de marca para asegurar que cada acción tenga un objetivo comercial tangible.",
    points: [
      "Auditoría profunda de la marca y de la competencia directa.",
      "Definición de pilares de contenido, tonos de voz y arquetipos de comunicación.",
      "Planificación mensual de contenidos con cronogramas de publicación claros.",
      "Optimización de biografías, enlaces estratégicos (Linktree / WhatsApp) y destacados.",
      "Estrategia de conversión enfocada en transformar espectadores en clientes fieles."
    ]
  },
  contenido: {
    title: "Creación de Contenido & Producción Audiovisual",
    badge: "Fase 02 — Ejecución Visual",
    description: "Producción audiovisual de alta calidad cinematográfica adaptada al lenguaje y ritmo de retención actual de las redes sociales.",
    points: [
      "Investigación de tendencias y redacción de guiones con ganchos (hooks) de alta retención.",
      "Jornadas de grabación en locación con equipo profesional, estabilización e iluminación.",
      "Edición dinámica orientada a la viralidad con cortes rápidos, sound design y subtítulos estilizados.",
      "Diseño de miniaturas y portadas de reels de alto impacto estético.",
      "Formatos variados: Reels educativos, testimoniales, detrás de cámaras y ventas directas."
    ]
  },
  comunidad: {
    title: "Gestión de Comunidad & Social Care",
    badge: "Fase 03 — Interacción & Fidelización",
    description: "Construcción de vínculos genuinos con la audiencia a través de un monitoreo constante y una gestión de respuestas activa y humanizada.",
    points: [
      "Organización y publicación estructurada de feeds e historias interactivas.",
      "Gestión de comentarios para generar conversaciones e impulsar el algoritmo.",
      "Atención ágil a mensajes directos (DMs) canalizando consultas hacia WhatsApp de ventas.",
      "Dinámicas de engagement en historias (encuestas, preguntas, quizzes, llamadas a la acción).",
      "Protección de reputación digital y moderación de spam."
    ]
  },
  rendimiento: {
    title: "Análisis de Rendimiento & Optimización",
    badge: "Fase 04 — Escalamiento",
    description: "Evaluación continua de las métricas clave para ajustar tácticas, identificar contenidos ganadores y maximizar el retorno de inversión.",
    points: [
      "Informes mensuales ejecutivos con métricas de alcance, interacción y crecimiento neto.",
      "Análisis de retención por segundo en reels para perfeccionar la fórmula creativa.",
      "Monitoreo de tasa de conversión de seguidores a prospectos calificados.",
      "Recomendaciones estratégicas de optimización para el siguiente ciclo mensual.",
      "Decisiones basadas en datos de Meta Business Suite y herramientas analíticas."
    ]
  }
};

/* ==========================================================================
   SCROLL LOCK MANAGER (Zero background movement on iOS Safari & Android)
   ========================================================================== */
let savedScrollY = 0;
let isBodyLocked = false;

function lockBodyScroll() {
  if (isBodyLocked) return;
  savedScrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  
  document.body.style.position = 'fixed';
  document.body.style.top = `-${savedScrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
  
  document.documentElement.classList.add('scroll-locked', 'modal-open');
  document.body.classList.add('scroll-locked', 'modal-open');
  isBodyLocked = true;
}

function unlockBodyScroll() {
  if (!isBodyLocked) return;
  
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  document.body.style.overflow = '';
  
  document.documentElement.classList.remove('scroll-locked', 'modal-open');
  document.body.classList.remove('scroll-locked', 'modal-open');
  isBodyLocked = false;
  
  window.scrollTo(0, savedScrollY);
}

function openModal(modalEl) {
  if (!modalEl) return;
  lockBodyScroll();
  modalEl.classList.add('active');
}

function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove('active');
  const remainingModal = document.querySelector('.modal-overlay.active');
  const drawer = document.getElementById('mobileDrawer');
  const drawerOpen = drawer && drawer.classList.contains('open');
  if (!remainingModal && !drawerOpen) {
    unlockBodyScroll();
  }
}

// Global Escape key listener for open modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const activeModal = document.querySelector('.modal-overlay.active');
    if (activeModal) closeModal(activeModal);
  }
});

function initFolderModals() {
  const folderCards = document.querySelectorAll('.folder-card');
  const modalOverlay = document.getElementById('detailsModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBadge = document.getElementById('modalBadge');
  const modalDesc = document.getElementById('modalDesc');
  const modalPoints = document.getElementById('modalPoints');
  const modalClose = document.getElementById('modalCloseBtn');
  const modalCtaBtn = document.getElementById('modalCtaBtn');

  if (!modalOverlay) return;

  folderCards.forEach(card => {
    card.addEventListener('click', () => {
      const serviceKey = card.getAttribute('data-service');
      const data = serviceData[serviceKey];
      if (!data) return;

      modalTitle.innerText = data.title;
      modalBadge.innerText = data.badge;
      modalDesc.innerText = data.description;

      modalPoints.innerHTML = data.points.map(pt => `
        <li class="modal-service-point-item">
          <span class="modal-service-point-icon">✓</span>
          <span>${pt}</span>
        </li>
      `).join('');

      openModal(modalOverlay);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      closeModal(modalOverlay);
    });
  }

  if (modalCtaBtn) {
    modalCtaBtn.addEventListener('click', () => {
      closeModal(modalOverlay);
    });
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal(modalOverlay);
    }
  });

  // Prevent background touch drag when touching backdrop
  modalOverlay.addEventListener('touchmove', (e) => {
    if (e.target === modalOverlay) {
      e.preventDefault();
    }
  }, { passive: false });
}

/* ==========================================================================
   5. PROJECT TABS FILTER
   ========================================================================== */
function initProjectTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const projectItems = document.querySelectorAll('[data-project-category]');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectItems.forEach(item => {
        const categories = item.getAttribute('data-project-category').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          item.style.display = '';
          item.style.opacity = '1';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. REELS LIGHTBOX & METRICS MODAL
   ========================================================================== */
const reelDetails = {
  dupes: {
    title: "Reel: 'Estas marcas ya tienen dupes'",
    brand: "Rosato Importa",
    views: "1,770,251",
    reach: "1,043,795",
    newFollowers: "+18,226",
    nonFollowersRatio: "99.2%",
    avgWatchTime: "21 s",
    strategy: "Estrategia de gancho de alto impacto y curiosidad sobre productos accesibles de moda. Se logró una retención masiva que provocó que el 99.2% de los espectadores fueran nuevos usuarios no seguidores, generando más de 18.000 seguidores en un solo video.",
    metricsImg: "assets/img/reel_dupes_metrics.png",
    thumbImg: "assets/img/reel_dupes.png"
  },
  shein: {
    title: "Reel: 'Los accesorios de Shein se ponen verdes'",
    brand: "Rosato Importa",
    views: "1,086,690",
    reach: "185,848",
    newFollowers: "+4,243",
    nonFollowersRatio: "94.9%",
    avgWatchTime: "26 s",
    strategy: "Derribo de objeción y educación del consumidor. El video abordó un dolor real y frecuente de los compradores, ofreciendo soluciones de importación confiables que impulsaron consultas de cotización inmediata.",
    metricsImg: "assets/img/reel_shein_metrics.png",
    thumbImg: "assets/img/reel_shein.png"
  },
  curvy: {
    title: "Reel: 'De un infinito curvy'",
    brand: "Rosato Importa",
    views: "451,307",
    reach: "333,541",
    newFollowers: "+11,326",
    nonFollowersRatio: "98.4%",
    avgWatchTime: "27 s",
    strategy: "Segmentación por nicho específico con alta empatía. El contenido resolvió una necesidad no atendida en ropa de tallas grandes, convirtiendo a más de 11.300 nuevas personas en seguidoras de la marca.",
    metricsImg: "assets/img/reel_curvy_metrics.png",
    thumbImg: "assets/img/reel_curvy.png"
  },
  tiendas: {
    title: "Reel: 'No necesitas comprar ropa de tiendas'",
    brand: "Rosato Importa",
    views: "53,013",
    reach: "35,700",
    newFollowers: "+1,112",
    nonFollowersRatio: "83.8%",
    avgWatchTime: "20 s",
    strategy: "Gancho contra-intuitivo para captar atención en los primeros 3 segundos. Enfocado directamente en despertar el interés de emprender importando ropa.",
    metricsImg: "assets/img/reel_tiendas_metrics.png",
    thumbImg: "assets/img/reel_tiendas.png"
  }
};

function initReelModals() {
  const reelCards = document.querySelectorAll('.reel-card');
  const reelModal = document.getElementById('reelModal');
  const reelModalClose = document.getElementById('reelModalClose');
  const reelModalBody = document.getElementById('reelModalBody');

  if (!reelModal || !reelCards.length) return;

  reelCards.forEach(card => {
    card.addEventListener('click', () => {
      const reelId = card.getAttribute('data-reel-id');
      const data = reelDetails[reelId];
      if (!data) return;

      reelModalBody.innerHTML = `
        <div class="reel-modal-grid">
          <div style="text-align:center;">
            <div style="position:relative; border-radius:12px; overflow:hidden; border:1px solid var(--border-subtle); max-width:280px; margin:0 auto; box-shadow:var(--shadow-md);">
              <img src="${data.thumbImg}" alt="${data.title}" style="width:100%; display:block;">
              <div style="position:absolute; top:12px; left:12px; background:rgba(0,0,0,0.8); color:#fff; font-size:0.8rem; font-weight:800; padding:4px 10px; border-radius:999px;">
                🔥 ${data.views} Views
              </div>
            </div>
          </div>
          <div>
            <span class="section-tag" style="margin-bottom:0.75rem;">${data.brand} — Caso Viral</span>
            <h3 style="font-size:1.6rem; margin-bottom:1rem; line-height:1.2;">${data.title}</h3>
            <p style="font-size:0.95rem; color:var(--text-secondary); line-height:1.6; margin-bottom:1.5rem;">${data.strategy}</p>
            
            <div style="background:var(--bg-secondary); border:1px solid var(--border-subtle); border-radius:12px; padding:1.2rem; margin-bottom:1.5rem;">
              <h5 style="font-size:0.85rem; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.85rem; letter-spacing:0.05em;">Métricas Certificadas de Meta</h5>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                <div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">Visualizaciones</div>
                  <div style="font-size:1.35rem; font-weight:800; color:var(--accent-cyan);">${data.views}</div>
                </div>
                <div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">Espectadores (Alcance)</div>
                  <div style="font-size:1.35rem; font-weight:800; color:var(--text-primary);">${data.reach}</div>
                </div>
                <div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">Nuevos Seguidores</div>
                  <div style="font-size:1.35rem; font-weight:800; color:#10b981;">${data.newFollowers}</div>
                </div>
                <div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">No seguidores (Viralidad)</div>
                  <div style="font-size:1.35rem; font-weight:800; color:var(--text-primary);">${data.nonFollowersRatio}</div>
                </div>
              </div>
            </div>

            <a href="https://wa.me/584246890741?text=${encodeURIComponent(`Hola Diego, vi tu caso de éxito en ${data.brand} (${data.title}) y quiero una estrategia similar para mi marca.`)}" target="_blank" class="btn btn-whatsapp btn-sm" style="width:100%;">
              Consultar estrategia para mi marca
            </a>
          </div>
        </div>
      `;

      openModal(reelModal);
    });
  });

  if (reelModalClose) {
    reelModalClose.addEventListener('click', () => {
      closeModal(reelModal);
    });
  }

  reelModal.addEventListener('click', (e) => {
    if (e.target === reelModal) {
      closeModal(reelModal);
    }
  });

  // Prevent background touch drag when touching backdrop
  reelModal.addEventListener('touchmove', (e) => {
    if (e.target === reelModal) {
      e.preventDefault();
    }
  }, { passive: false });
}

/* ==========================================================================
   7. INTERACTIVE QUOTE CALCULATOR & WHATSAPP GENERATOR
   ========================================================================== */
function initQuoteCalculator() {
  const planRadios = document.querySelectorAll('input[name="selectedPlan"]');
  const pautaInput = document.getElementById('calcPautaCount');
  const adsInput = document.getElementById('calcAdsCount');
  const contractTerm = document.getElementById('calcContractTerm');

  // Summary elements
  const summaryPlanName = document.getElementById('summaryPlanName');
  const summaryPlanPrice = document.getElementById('summaryPlanPrice');
  const summaryAddonsList = document.getElementById('summaryAddonsList');
  const summaryDiscountRow = document.getElementById('summaryDiscountRow');
  const summaryDiscountVal = document.getElementById('summaryDiscountVal');
  const summaryTotal = document.getElementById('summaryTotal');
  const sendQuoteWhatsAppBtn = document.getElementById('sendQuoteWhatsAppBtn');

  if (!planRadios.length || !summaryTotal) return;

  function calculateQuote() {
    let basePrice = 249;
    let planTitle = "Plan 8 Reels / Mes";
    
    planRadios.forEach(radio => {
      if (radio.checked) {
        basePrice = parseFloat(radio.value);
        planTitle = radio.getAttribute('data-plan-name');
      }
    });

    const pautaCount = parseInt(pautaInput ? pautaInput.value : 0, 10) || 0;
    const adsCount = parseInt(adsInput ? adsInput.value : 0, 10) || 0;
    const termMonths = parseInt(contractTerm ? contractTerm.value : 1, 10) || 1;

    const pautaTotal = pautaCount * 89;
    const adsTotal = adsCount * 59;
    const subtotalMonthly = basePrice + pautaTotal + adsTotal;

    // Term discounts: 3 months = 5% off, 6 months = 10% off
    let discountPercent = 0;
    if (termMonths === 3) discountPercent = 0.05;
    if (termMonths === 6) discountPercent = 0.10;

    const subtotalContract = subtotalMonthly * termMonths;
    const discountAmount = subtotalContract * discountPercent;
    const finalTotal = subtotalContract - discountAmount;

    // Update UI elements
    if (summaryPlanName) summaryPlanName.innerText = planTitle;
    if (summaryPlanPrice) summaryPlanPrice.innerText = `$${basePrice} USD/mes`;

    // Addons summary
    let addonsHtml = '';
    if (pautaCount > 0) {
      addonsHtml += `
        <div class="summary-row">
          <span>+ ${pautaCount} Pauta(s) de Grabación ($89 c/u)</span>
          <span>$${pautaTotal} USD</span>
        </div>`;
    }
    if (adsCount > 0) {
      addonsHtml += `
        <div class="summary-row">
          <span>+ ${adsCount} Campaña(s) Meta Ads ($59 c/u)</span>
          <span>$${adsTotal} USD</span>
        </div>`;
    }
    if (termMonths > 1) {
      addonsHtml += `
        <div class="summary-row">
          <span>Duración estimada</span>
          <span>${termMonths} Meses</span>
        </div>`;
    }

    if (summaryAddonsList) summaryAddonsList.innerHTML = addonsHtml;

    if (discountPercent > 0) {
      if (summaryDiscountRow) summaryDiscountRow.style.display = 'flex';
      if (summaryDiscountVal) summaryDiscountVal.innerText = `-$${discountAmount.toFixed(0)} USD (${discountPercent * 100}%)`;
    } else {
      if (summaryDiscountRow) summaryDiscountRow.style.display = 'none';
    }

    if (summaryTotal) summaryTotal.innerText = `$${finalTotal.toFixed(0)} USD`;

    // WhatsApp Message Builder
    let waMsg = `¡Hola Diego! Estuve viendo tu portafolio web interactivo y me gustaría cotizar el siguiente plan para mi marca:\n\n`;
    waMsg += `📌 *${planTitle}* ($${basePrice} USD/mes)\n`;
    if (pautaCount > 0) waMsg += `🎬 *Pautas de Grabación:* ${pautaCount} pauta(s) (+$${pautaTotal} USD)\n`;
    if (adsCount > 0) waMsg += `📣 *Campañas Meta Ads:* ${adsCount} campaña(s) (+$${adsTotal} USD)\n`;
    if (termMonths > 1) {
      waMsg += `⏱️ *Período estimado:* ${termMonths} meses\n`;
      if (discountPercent > 0) waMsg += `🎁 *Descuento aplicado:* ${discountPercent * 100}%\n`;
    }
    waMsg += `\n💰 *Inversión Total Estimada:* $${finalTotal.toFixed(0)} USD\n\n`;
    waMsg += `¿Cuándo podríamos agendar una breve reunión para revisar los objetivos de mi negocio?`;

    if (sendQuoteWhatsAppBtn) {
      sendQuoteWhatsAppBtn.href = `https://wa.me/584246890741?text=${encodeURIComponent(waMsg)}`;
    }
  }

  // Event Listeners
  planRadios.forEach(radio => radio.addEventListener('change', calculateQuote));
  if (pautaInput) pautaInput.addEventListener('input', calculateQuote);
  if (adsInput) adsInput.addEventListener('input', calculateQuote);
  if (contractTerm) contractTerm.addEventListener('change', calculateQuote);

  // Initial Calculation
  calculateQuote();
}
