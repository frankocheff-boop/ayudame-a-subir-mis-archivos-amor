/**
 * Login Page Logic
 */

document.addEventListener('DOMContentLoaded', function() {
    // If already authenticated, redirect to main page
    if (AuthService.isAuthenticated()) {
        window.location.href = '../index.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = rememberMeCheckbox.checked;

        // Clear previous error
        hideError();

        // Validate input
        if (!username || !password) {
            showError(getTranslation('login.emptyFields', 'Por favor complete todos los campos'));
            return;
        }

        // Attempt login
        const result = AuthService.login(username, password, rememberMe);

        if (result.success) {
            // Success - redirect to main page
            showSuccess();
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 500);
        } else {
            // Show error
            showError(getTranslation('login.invalidCredentials', result.error));
        }
    });

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
    }

    // Hide error message
    function hideError() {
        errorMessage.classList.remove('show');
    }

    // Show success feedback
    function showSuccess() {
        loginForm.style.opacity = '0.6';
        loginForm.style.pointerEvents = 'none';
    }

    // Get translation (fallback to i18n system if available)
    function getTranslation(key, defaultText) {
        if (typeof window.i18n !== 'undefined' && window.i18n.t) {
            return window.i18n.t(key);
        }
        return defaultText;
    }

    // Language change handler
    window.changeLanguage = function(lang) {
        if (typeof window.i18n !== 'undefined' && window.i18n.setLanguage) {
            window.i18n.setLanguage(lang);
            updateLanguageButtons(lang);
        }
    };

    // Update language button states
    function updateLanguageButtons(activeLang) {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.getAttribute('data-lang') === activeLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Set initial language button state
    const currentLang = localStorage.getItem('verano_language') || 'es';
    updateLanguageButtons(currentLang);

    // Clear error on input
    usernameInput.addEventListener('input', hideError);
    passwordInput.addEventListener('input', hideError);
});
