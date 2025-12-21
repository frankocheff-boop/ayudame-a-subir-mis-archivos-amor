// VERANO ESTATE Digital World - SPA Navigation System
class DigitalWorld {
  constructor() {
    this.currentSection = 'home';
    this.sections = ['home', 'menu', 'guests', 'pos', 'about'];
    this.loadedSections = new Set(['home']); // Home is always loaded
    this.isTransitioning = false;
  }

  // Initialize the digital world
  init() {
    this.setupNavigation();
    this.setupLanguageToggle();
    this.setupThemeToggle();
    this.setupURLHandling();
    this.loadInitialSection();
  }

  // Setup navigation button handlers
  setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const section = e.currentTarget.dataset.section;
        this.navigateTo(section);
      });
    });

    // Logo click returns to home
    const logo = document.querySelector('.logo-section');
    if (logo) {
      logo.addEventListener('click', () => {
        this.navigateTo('home');
      });
    }
  }

  // Setup language toggle
  setupLanguageToggle() {
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
      langToggle.addEventListener('click', () => {
        const currentLang = i18n.getCurrentLanguage();
        const newLang = currentLang === 'es' ? 'en' : 'es';
        i18n.changeLanguage(newLang);
        this.updateLanguageButton(newLang);
      });
    }
  }

  // Update language button display
  updateLanguageButton(lang) {
    const flag = document.querySelector('#lang-toggle .flag');
    const text = document.querySelector('#lang-toggle .lang-text');
    
    if (flag && text) {
      if (lang === 'es') {
        flag.textContent = '🇪🇸';
        text.textContent = 'ES';
      } else {
        flag.textContent = '🇺🇸';
        text.textContent = 'EN';
      }
    }
  }

  // Setup theme toggle
  setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        themeManager.toggle();
      });
    }
  }

  // Setup URL hash handling
  setupURLHandling() {
    // Listen for hash changes
    window.addEventListener('hashchange', () => {
      this.handleURLChange();
    });

    // Listen for back/forward navigation
    window.addEventListener('popstate', () => {
      this.handleURLChange();
    });
  }

  // Handle URL changes
  handleURLChange() {
    const hash = window.location.hash.slice(1); // Remove #
    if (hash && this.sections.includes(hash)) {
      this.navigateTo(hash, false); // false = don't update URL again
    } else if (!hash) {
      this.navigateTo('home', false);
    }
  }

  // Load initial section based on URL
  loadInitialSection() {
    const hash = window.location.hash.slice(1);
    if (hash && this.sections.includes(hash)) {
      this.navigateTo(hash, false);
    } else {
      this.navigateTo('home', false);
    }
  }

  // Navigate to a section
  async navigateTo(section, updateURL = true) {
    // Validate section
    if (!this.sections.includes(section)) {
      console.error('Invalid section:', section);
      return;
    }

    // Prevent navigation during transition
    if (this.isTransitioning) {
      return;
    }

    // Don't navigate if already on this section
    if (section === this.currentSection) {
      return;
    }

    this.isTransitioning = true;

    // Hide current section with fade out
    const current = document.querySelector('.world-section.active');
    if (current) {
      current.classList.add('fade-out');
    }

    // Wait for fade out animation
    await this.wait(300);

    if (current) {
      current.classList.remove('active', 'fade-out');
    }

    // Load section content if needed
    await this.loadSectionContent(section);

    // Show new section with fade in
    const next = document.getElementById(`${section}-section`);
    if (next) {
      next.classList.add('active', 'fade-in');
      
      // Remove fade-in class after animation
      setTimeout(() => {
        next.classList.remove('fade-in');
      }, 300);
    }

    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.section === section);
    });

    // Update URL without reload
    if (updateURL) {
      history.pushState({ section }, '', `#${section}`);
    }

    this.currentSection = section;
    this.isTransitioning = false;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Load section content dynamically
  async loadSectionContent(section) {
    // Skip if already loaded
    if (this.loadedSections.has(section)) {
      return;
    }

    // Show loading state
    const container = document.querySelector(`#${section}-section .content-container`);
    if (!container) {
      return;
    }

    const originalContent = container.innerHTML;
    container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    try {
      switch(section) {
        case 'guests':
          await this.loadGuestForm(container);
          break;
        case 'pos':
          await this.loadPOSSelector(container);
          break;
        default:
          // Section content is already in HTML
          container.innerHTML = originalContent;
          break;
      }

      this.loadedSections.add(section);
    } catch (error) {
      console.error(`Error loading ${section} section:`, error);
      container.innerHTML = `<div class="error">Error loading content. Please try again.</div>`;
    }
  }

  // Load guest form section
  async loadGuestForm(container) {
    try {
      const response = await fetch('./pages/guest-form.html');
      if (!response.ok) throw new Error('Failed to load guest form');
      
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Extract main content from guest form
      const main = doc.querySelector('main');
      if (main) {
        container.innerHTML = main.innerHTML;
        
        // Re-initialize guest form if needed
        if (window.initGuestForm) {
          window.initGuestForm();
        }
        
        // Update translations
        if (window.i18n) {
          i18n.updateUI();
        }
      }
    } catch (error) {
      throw error;
    }
  }

  // Load POS selector
  async loadPOSSelector(container) {
    container.innerHTML = `
      <div class="pos-selector">
        <h2 class="section-title" data-i18n="pos.selectSystem">Select POS System</h2>
        <p class="text-center mb-xl" style="color: var(--text-muted); font-size: 1.1rem;" data-i18n="pos.selectDesc">
          Choose the point of sale system that best fits your needs
        </p>
        <div class="pos-options">
          <div class="pos-card" data-pos="neon">
            <div class="pos-icon">⚡</div>
            <h3>POS Neon</h3>
            <p data-i18n="pos.neonDesc">Modern cyberpunk design for bars and events</p>
            <button class="btn-primary" onclick="digitalWorld.openPOS('neon')">
              <span data-i18n="pos.open">Open System</span>
            </button>
          </div>
          
          <div class="pos-card" data-pos="restaurant">
            <div class="pos-icon">🍴</div>
            <h3>POS Restaurant</h3>
            <p data-i18n="pos.restaurantDesc">Professional classic system for restaurants</p>
            <button class="btn-primary" onclick="digitalWorld.openPOS('restaurant')">
              <span data-i18n="pos.open">Open System</span>
            </button>
          </div>
        </div>
      </div>
    `;
    
    // Update translations
    if (window.i18n) {
      i18n.updateUI();
    }
  }

  // Open POS system in new window
  openPOS(type) {
    const url = type === 'neon' ? './pages/pos-neon.html' : './pages/pos-restaurant.html';
    window.open(url, '_blank', 'width=1400,height=900');
  }

  // Update dashboard stats (can be called externally)
  updateStats(stats) {
    if (stats.guests !== undefined) {
      const guestsEl = document.getElementById('total-guests');
      if (guestsEl) guestsEl.textContent = stats.guests;
    }
    
    if (stats.sales !== undefined) {
      const salesEl = document.getElementById('today-sales');
      if (salesEl) salesEl.textContent = `$${stats.sales}`;
    }
  }

  // Utility: Wait for specified milliseconds
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize Digital World when DOM is ready
let digitalWorld;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    digitalWorld = new DigitalWorld();
    digitalWorld.init();
  });
} else {
  digitalWorld = new DigitalWorld();
  digitalWorld.init();
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DigitalWorld;
}
