/**
 * Authentication Module for VERANO ESTATE
 * Handles user authentication and session management
 */

const AUTH_CONFIG = {
    SESSION_KEY: 'verano_session',
    USER_KEY: 'verano_user',
    REMEMBER_KEY: 'verano_remember',
    // Default credentials (can be changed by admin)
    DEFAULT_CREDENTIALS: {
        username: 'admin',
        password: 'verano2025'
    }
};

/**
 * Authentication Service
 */
const AuthService = {
    /**
     * Initialize authentication service
     */
    init() {
        // Check if user should be remembered
        const rememberToken = localStorage.getItem(AUTH_CONFIG.REMEMBER_KEY);
        if (rememberToken) {
            try {
                const userData = JSON.parse(atob(rememberToken));
                if (userData.username) {
                    this.createSession(userData.username);
                }
            } catch (e) {
                // Invalid token, clear it
                localStorage.removeItem(AUTH_CONFIG.REMEMBER_KEY);
            }
        }
    },

    /**
     * Validate credentials
     */
    validateCredentials(username, password) {
        // Check against default credentials
        if (username === AUTH_CONFIG.DEFAULT_CREDENTIALS.username && 
            password === AUTH_CONFIG.DEFAULT_CREDENTIALS.password) {
            return true;
        }

        // Check against stored custom credentials
        const storedCreds = localStorage.getItem('verano_custom_credentials');
        if (storedCreds) {
            try {
                const customCreds = JSON.parse(storedCreds);
                return username === customCreds.username && password === customCreds.password;
            } catch (e) {
                console.error('Error parsing custom credentials:', e);
            }
        }

        return false;
    },

    /**
     * Login user
     */
    login(username, password, rememberMe = false) {
        if (this.validateCredentials(username, password)) {
            this.createSession(username);
            
            if (rememberMe) {
                const token = btoa(JSON.stringify({ username }));
                localStorage.setItem(AUTH_CONFIG.REMEMBER_KEY, token);
            } else {
                localStorage.removeItem(AUTH_CONFIG.REMEMBER_KEY);
            }
            
            return { success: true };
        }
        
        return { 
            success: false, 
            error: 'Usuario o contraseña incorrectos' 
        };
    },

    /**
     * Create user session
     */
    createSession(username) {
        const sessionData = {
            username,
            loginTime: new Date().toISOString(),
            sessionId: this.generateSessionId()
        };
        
        sessionStorage.setItem(AUTH_CONFIG.SESSION_KEY, JSON.stringify(sessionData));
        localStorage.setItem(AUTH_CONFIG.USER_KEY, username);
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return sessionStorage.getItem(AUTH_CONFIG.SESSION_KEY) !== null;
    },

    /**
     * Get current session
     */
    getSession() {
        const sessionData = sessionStorage.getItem(AUTH_CONFIG.SESSION_KEY);
        return sessionData ? JSON.parse(sessionData) : null;
    },

    /**
     * Get current user
     */
    getCurrentUser() {
        const session = this.getSession();
        return session ? session.username : null;
    },

    /**
     * Logout user
     */
    logout() {
        sessionStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
        localStorage.removeItem(AUTH_CONFIG.USER_KEY);
        localStorage.removeItem(AUTH_CONFIG.REMEMBER_KEY);
    },

    /**
     * Generate random session ID
     */
    generateSessionId() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    },

    /**
     * Redirect to login if not authenticated
     */
    requireAuth(redirectUrl = '../pages/login.html') {
        if (!this.isAuthenticated()) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    },

    /**
     * Update custom credentials (admin only)
     */
    updateCredentials(newUsername, newPassword) {
        if (this.isAuthenticated()) {
            const customCreds = {
                username: newUsername,
                password: newPassword
            };
            localStorage.setItem('verano_custom_credentials', JSON.stringify(customCreds));
            return true;
        }
        return false;
    }
};

// Initialize on load
if (typeof window !== 'undefined') {
    AuthService.init();
}
