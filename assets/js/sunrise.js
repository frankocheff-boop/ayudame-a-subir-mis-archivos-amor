/* ============================================
   Sunrise Animation - Dynamic Sky
   For HOME - Franko & SOL Forever
   ============================================ */

// Sunrise controller
const SunriseController = {
    canvas: null,
    ctx: null,
    
    // Initialize
    init: function() {
        // Create canvas for sunrise effect
        const background = document.getElementById('sunriseBackground');
        if (!background) return;
        
        this.updateSkyColor();
        
        // Update every minute
        setInterval(() => this.updateSkyColor(), 60000);
        
        // Add floating elements
        this.createFloatingHearts();
        this.createSunRays();
    },
    
    // Get current time-based gradient
    updateSkyColor: function() {
        const background = document.getElementById('sunriseBackground');
        if (!background) return;
        
        const hour = new Date().getHours();
        let gradient;
        
        // Dawn (5-7 AM)
        if (hour >= 5 && hour < 7) {
            gradient = 'linear-gradient(180deg, #FF8C42 0%, #FFD700 50%, #FFF8E7 100%)';
        }
        // Morning (7-10 AM)
        else if (hour >= 7 && hour < 10) {
            gradient = 'linear-gradient(180deg, #87CEEB 0%, #FFD700 50%, #FFF8E7 100%)';
        }
        // Day (10 AM - 5 PM)
        else if (hour >= 10 && hour < 17) {
            gradient = 'linear-gradient(135deg, #FFD700 0%, #FF8C42 50%, #87CEEB 100%)';
        }
        // Dusk (5-7 PM)
        else if (hour >= 17 && hour < 19) {
            gradient = 'linear-gradient(180deg, #FF6B6B 0%, #FF8C42 50%, #1a1a2e 100%)';
        }
        // Evening (7-9 PM)
        else if (hour >= 19 && hour < 21) {
            gradient = 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';
        }
        // Night (9 PM - 5 AM)
        else {
            gradient = 'linear-gradient(180deg, #0f3460 0%, #1a1a2e 50%, #16213e 100%)';
            this.addStars(background);
        }
        
        background.style.background = gradient;
        background.style.transition = 'background 2s ease';
    },
    
    // Add stars for night time
    addStars: function(background) {
        // Remove existing stars
        const existingStars = background.querySelectorAll('.star');
        existingStars.forEach(star => star.remove());
        
        // Add new stars
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: white;
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                opacity: ${Math.random()};
                animation: twinkle ${2 + Math.random() * 3}s ease-in-out infinite;
            `;
            background.appendChild(star);
        }
        
        // Add twinkle animation if not exists
        if (!document.getElementById('star-animations')) {
            const style = document.createElement('style');
            style.id = 'star-animations';
            style.textContent = `
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    },
    
    // Create floating hearts
    createFloatingHearts: function() {
        setInterval(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = '💛';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDuration = (8 + Math.random() * 4) + 's';
            heart.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
            heart.style.animationDelay = Math.random() * 2 + 's';
            
            document.body.appendChild(heart);
            
            // Remove after animation
            setTimeout(() => heart.remove(), 12000);
        }, 5000); // Create a heart every 5 seconds
    },
    
    // Create sun rays effect
    createSunRays: function() {
        const raysContainer = document.createElement('div');
        raysContainer.className = 'sun-rays';
        raysContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        `;
        
        // Create multiple rays
        for (let i = 0; i < 8; i++) {
            const ray = document.createElement('div');
            ray.className = 'sun-ray';
            ray.style.cssText = `
                position: absolute;
                width: 2px;
                height: 100%;
                background: linear-gradient(180deg, 
                    transparent 0%, 
                    rgba(255, 215, 0, 0.1) 50%, 
                    transparent 100%);
                left: ${i * 12.5}%;
                animation: lightBeam ${10 + i * 2}s linear infinite;
                animation-delay: ${i * 0.5}s;
            `;
            raysContainer.appendChild(ray);
        }
        
        document.body.appendChild(raysContainer);
    },
    
    // Simulate sunrise/sunset animation
    simulateSunMovement: function() {
        const sun = document.createElement('div');
        sun.className = 'animated-sun';
        sun.style.cssText = `
            position: fixed;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: radial-gradient(circle, #FFD700 0%, #FF8C42 100%);
            box-shadow: 0 0 60px rgba(255, 215, 0, 0.8);
            z-index: 2;
            pointer-events: none;
        `;
        
        const hour = new Date().getHours();
        
        // Calculate sun position based on time
        let top, left;
        if (hour >= 6 && hour < 18) {
            // Day time - sun is visible
            const progress = (hour - 6) / 12; // 0 to 1
            top = 100 - (Math.sin(progress * Math.PI) * 70) + '%';
            left = (progress * 80 + 10) + '%';
            document.body.appendChild(sun);
            sun.style.top = top;
            sun.style.left = left;
        }
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    SunriseController.init();
    SunriseController.simulateSunMovement();
});

// Make globally available
window.SunriseController = SunriseController;
