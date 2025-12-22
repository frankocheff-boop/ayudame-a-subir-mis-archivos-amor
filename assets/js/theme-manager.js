// Theme Manager for VERANO ESTATE Digital World
class ThemeManager {
  constructor() {
    this.theme = this.getStoredTheme() || this.detectSystemTheme();
    this.init();
  }

  // Get stored theme from localStorage
  getStoredTheme() {
    return localStorage.getItem('verano_estate_theme');
  }

  // Detect system theme preference
  detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  // Store theme preference
  setStoredTheme(theme) {
    localStorage.setItem('verano_estate_theme', theme);
  }

  // Initialize theme
  init() {
    this.applyTheme();
    this.setupSystemThemeListener();
  }

  // Toggle between light and dark theme
  toggle() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme();
    this.setStoredTheme(this.theme);
    
    // Dispatch custom event for other parts of the app
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: this.theme } 
    }));
  }

  // Apply theme to document
  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    this.updateToggleButton();
  }

  // Update theme toggle button icon
  updateToggleButton() {
    const icon = document.querySelector('#theme-toggle .icon');
    if (icon) {
      icon.textContent = this.theme === 'light' ? '🌙' : '☀️';
    }
  }

  // Listen for system theme changes
  setupSystemThemeListener() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', (e) => {
          // Only update if user hasn't manually set a preference
          if (!this.getStoredTheme()) {
            this.theme = e.matches ? 'dark' : 'light';
            this.applyTheme();
          }
        });
      } 
      // Older browsers
      else if (mediaQuery.addListener) {
        mediaQuery.addListener((e) => {
          if (!this.getStoredTheme()) {
            this.theme = e.matches ? 'dark' : 'light';
            this.applyTheme();
          }
        });
      }
    }
  }

  // Get current theme
  getCurrentTheme() {
    return this.theme;
  }

  // Set specific theme
  setTheme(theme) {
    if (theme === 'light' || theme === 'dark') {
      this.theme = theme;
      this.applyTheme();
      this.setStoredTheme(theme);
    }
  }
}

// Create global instance
const themeManager = new ThemeManager();

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = themeManager;
}
