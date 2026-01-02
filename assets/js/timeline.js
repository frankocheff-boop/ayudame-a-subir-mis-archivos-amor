/* ============================================
   Timeline JavaScript Helper
   For HOME - Franko & SOL Forever
   ============================================ */

const TimelineHelper = {
    // Format date for display
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    },
    
    // Get icon for event type
    getTypeIcon: function(type) {
        const icons = {
            milestone: '🎯',
            love: '💛',
            emotional: '😭',
            funny: '😂',
            achievement: '🏆',
            default: '✨'
        };
        return icons[type] || icons.default;
    },
    
    // Sort timeline events
    sortTimeline: function(events, order = 'desc') {
        return events.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return order === 'desc' ? dateB - dateA : dateA - dateB;
        });
    }
};

// Make globally available
window.TimelineHelper = TimelineHelper;
