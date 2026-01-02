/* ============================================
   Love Counter - Real-time Counters
   For HOME - Franko & SOL Forever
   ============================================ */

// Date when Franko and SOL got together
const TOGETHER_SINCE = new Date('2025-12-30T20:00:00');

// Counter update function
function updateCounters() {
    const now = new Date();
    const diff = now - TOGETHER_SINCE;
    
    // Calculate days
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    // Calculate hours
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    // Update DOM elements
    const daysCounter = document.getElementById('daysCounter');
    const hoursCounter = document.getElementById('hoursCounter');
    
    if (daysCounter) {
        daysCounter.textContent = days;
        // Add animation class
        daysCounter.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            daysCounter.style.animation = '';
        }, 500);
    }
    
    if (hoursCounter) {
        hoursCounter.textContent = hours.toLocaleString();
        // Add animation class
        hoursCounter.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            hoursCounter.style.animation = '';
        }, 500);
    }
}

// Update counters every second
setInterval(updateCounters, 1000);

// Initial update
document.addEventListener('DOMContentLoaded', updateCounters);

// Milestone checker - shows special message on milestones
function checkMilestones() {
    const now = new Date();
    const diff = now - TOGETHER_SINCE;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    const milestones = [
        { day: 7, message: '🎉 ¡Una semana juntos! 💛' },
        { day: 30, message: '🎊 ¡Un mes de amor! 💛' },
        { day: 100, message: '✨ ¡100 días de eternidad! 💛' },
        { day: 365, message: '🎆 ¡UN AÑO JUNTOS! 💛💍' },
        { day: 730, message: '💫 ¡DOS AÑOS DE AMOR INFINITO! 💛' }
    ];
    
    milestones.forEach(milestone => {
        if (days === milestone.day) {
            showMilestoneMessage(milestone.message);
        }
    });
}

// Show milestone message
function showMilestoneMessage(message) {
    // Check if we already showed this today
    const lastShown = localStorage.getItem('lastMilestoneShown');
    const today = new Date().toDateString();
    
    if (lastShown === today) return;
    
    // Create milestone popup
    const popup = document.createElement('div');
    popup.className = 'milestone-popup';
    popup.innerHTML = `
        <div class="milestone-content">
            <h2>${message}</h2>
            <p>Este es un día especial en nuestra historia</p>
            <button onclick="this.parentElement.parentElement.remove()">
                💛 Celebrar 💛
            </button>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Save that we showed it today
    localStorage.setItem('lastMilestoneShown', today);
    
    // Add CSS for popup if not already added
    if (!document.getElementById('milestone-popup-styles')) {
        const style = document.createElement('style');
        style.id = 'milestone-popup-styles';
        style.textContent = `
            .milestone-popup {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.5s ease;
            }
            
            .milestone-content {
                background: white;
                padding: 3rem;
                border-radius: 30px;
                text-align: center;
                max-width: 500px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                animation: zoomIn 0.5s ease;
            }
            
            .milestone-content h2 {
                font-family: 'Playfair Display', serif;
                font-size: 2rem;
                color: #FFD700;
                margin-bottom: 1rem;
            }
            
            .milestone-content p {
                font-size: 1.2rem;
                margin-bottom: 2rem;
                color: #1a1a2e;
            }
            
            .milestone-content button {
                padding: 1rem 3rem;
                font-size: 1.2rem;
                background: linear-gradient(135deg, #FFD700, #FF8C42);
                color: white;
                border: none;
                border-radius: 50px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
            }
            
            .milestone-content button:hover {
                transform: scale(1.05);
            }
        `;
        document.head.appendChild(style);
    }
}

// Check for milestones every hour
setInterval(checkMilestones, 1000 * 60 * 60);
checkMilestones(); // Check on load

// Export functions
window.LoveCounter = {
    updateCounters,
    checkMilestones,
    TOGETHER_SINCE
};
