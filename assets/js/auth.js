/**
 * Authentication Module for VERANO ESTATE
 * Handles user authentication and session management
 * 
 * SECURITY NOTE: This is a client-side only authentication system
 * suitable for demo/single-user deployments. For production use with
 * multiple users and sensitive data, implement proper server-side
 * authentication with encrypted passwords, JWT tokens, and HTTPS.
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
                // Simple obfuscation - in production, use proper encryption
                const userData = JSON.parse(this.decode(rememberToken));
                if (userData.username && userData.timestamp) {
                    // Check if token is not older than 30 days
                    const tokenAge = Date.now() - userData.timestamp;
                    if (tokenAge < 30 * 24 * 60 * 60 * 1000) {
                        this.createSession(userData.username);
                    } else {
                        // Token expired, clear it
                        localStorage.removeItem(AUTH_CONFIG.REMEMBER_KEY);
                    }
                }
            } catch (e) {
                // Invalid token, clear it
                localStorage.removeItem(AUTH_CONFIG.REMEMBER_KEY);
            }
        }
    },

    /**
     * Simple encode function
     * NOTE: This provides obfuscation only, not encryption.
     * For production, use proper JWT tokens or server-side sessions.
     */
    encode(data) {
        return btoa(encodeURIComponent(data).split('').reverse().join(''));
    },

    /**
     * Simple decode function
     * NOTE: This provides obfuscation only, not encryption.
     * For production, use proper JWT tokens or server-side sessions.
     */
    decode(data) {
        return decodeURIComponent(atob(data).split('').reverse().join(''));
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
                const tokenData = {
                    username,
                    timestamp: Date.now()
                };
                const token = this.encode(JSON.stringify(tokenData));
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
