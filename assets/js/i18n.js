// Sistema de traducción i18n para VERANO ESTATE
class I18n {
    constructor() {
        this.currentLang = this.getStoredLanguage() || this.detectBrowserLanguage();
        this.translations = {};
        this.initialized = false;
    }

    // Detectar idioma del navegador
    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang.startsWith('es') ? 'es' : 'en';
    }

    // Obtener idioma guardado en localStorage
    getStoredLanguage() {
        return localStorage.getItem('verano_estate_lang');
    }

    // Guardar idioma en localStorage
    setStoredLanguage(lang) {
        localStorage.setItem('verano_estate_lang', lang);
    }

    // Cargar archivos de traducción
    async loadTranslations(lang) {
        try {
            const response = await fetch(`../locales/${lang}.json`);
            if (!response.ok) throw new Error(`Failed to load ${lang} translations`);
            this.translations[lang] = await response.json();
            return true;
        } catch (error) {
            console.error('Error loading translations:', error);
            return false;
        }
    }

    // Inicializar el sistema de traducción
    async init() {
        // Cargar ambos idiomas
        await Promise.all([
            this.loadTranslations('es'),
            this.loadTranslations('en')
        ]);
        this.initialized = true;
        this.updateUI();
    }

    // Obtener texto traducido usando notación de punto
    t(key) {
        if (!this.initialized) return key;
        
        const keys = key.split('.');
        let value = this.translations[this.currentLang];
        
        for (const k of keys) {
            if (value && value[k] !== undefined) {
                value = value[k];
            } else {
                return key; // Retornar la clave si no se encuentra la traducción
            }
        }
        
        return value;
    }

    // Cambiar idioma
    async changeLanguage(lang) {
        if (lang !== 'es' && lang !== 'en') {
            console.error('Invalid language:', lang);
            return;
        }

        this.currentLang = lang;
        this.setStoredLanguage(lang);
        this.updateUI();
        
        // Disparar evento personalizado para que otras partes de la app puedan reaccionar
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }

    // Actualizar UI con las traducciones
    updateUI() {
        // Actualizar elementos con atributo data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });

        // Actualizar placeholders con atributo data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });

        // Actualizar títulos con atributo data-i18n-title
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });

        // Actualizar el selector de idioma si existe
        this.updateLanguageSelector();

        // Actualizar el atributo lang del documento
        document.documentElement.lang = this.currentLang;
    }

    // Actualizar el selector de idioma
    updateLanguageSelector() {
        const selector = document.getElementById('language-selector');
        if (selector) {
            selector.value = this.currentLang;
        }

        // Actualizar botones de idioma
        document.querySelectorAll('[data-lang-btn]').forEach(btn => {
            const btnLang = btn.getAttribute('data-lang-btn');
            if (btnLang === this.currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Obtener idioma actual
    getCurrentLanguage() {
        return this.currentLang;
    }
}

// Crear instancia global
const i18n = new I18n();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = i18n;
}
