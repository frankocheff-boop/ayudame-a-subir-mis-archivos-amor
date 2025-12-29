// POS NEON - JavaScript
// Sistema de punto de venta estilo cyberpunk

const products = [
    { id: 1, title: "Seasonal Fruits", price: 12.00, category: "Breakfast", description: "Fresh selection of seasonal fruits.", emoji: "🍉" },
    { id: 2, title: "Eggs Your Way", price: 14.00, category: "Breakfast", description: "Ranchero, Mexican style, poached, or custom omelet.", emoji: "🍳" },
    { id: 3, title: "Mexican Burritos", price: 16.00, category: "Breakfast", description: "Chicken, Beef, or Shrimp. With Guacamole.", emoji: "🌯" },
    { id: 4, title: "Black Bean Soup", price: 11.00, category: "Soup", description: "Red onion, epazote, tortilla strips, bacon.", emoji: "🥣" },
    { id: 5, title: "Spinach Soup", price: 12.00, category: "Soup", description: "Organic spinach and field mushrooms.", emoji: "🍄" },
    { id: 6, title: "Tortilla Soup", price: 11.50, category: "Soup", description: "Avocado, fresh mint, Manchego cheese.", emoji: "🥑" },
    { id: 7, title: "Organic Salad", price: 13.00, category: "Salad", description: "Jicama, endives, apple ginger honey dressing.", emoji: "🥗" },
    { id: 8, title: "Villa Salad", price: 14.50, category: "Salad", description: "Three bean medley, Panela cheese.", emoji: "🧀" },
    { id: 9, title: "Spinach Salad", price: 15.00, category: "Salad", description: "Bacon, garlic croutons, Swiss cheese.", emoji: "🥬" },
    { id: 10, title: "Caprese Salad", price: 14.00, category: "Salad", description: "Roma Tomatoes, Mozzarella, organic basil.", emoji: "🍅" },
    { id: 11, title: "Catch of the Day", price: 26.00, category: "Main", description: "Pan fried, white wine sauce, saffron pilaf.", emoji: "🐟" },
    { id: 12, title: "Giant Shrimp", price: 29.00, category: "Main", description: "Garlic butter, pilaf, seasonal vegetables.", emoji: "🦐" },
    { id: 13, title: "Paella Valenciana", price: 28.00, category: "Main", description: "Saffron rice and mixed meats/seafood.", emoji: "🥘" },
    { id: 14, title: "Homemade Lasagna", price: 22.00, category: "Main", description: "Our guest's favorite homemade Lasagna.", emoji: "🍝" },
    { id: 15, title: "Barbeque Night", price: 27.00, category: "Main", description: "Ribs and Chicken in exotic BBQ sauce.", emoji: "🍖" },
    { id: 16, title: "Cheese Platter", price: 16.00, category: "Sweet", description: "Selection of fine artisan cheeses.", emoji: "🧀" },
    { id: 17, title: "Vanilla Flan", price: 9.00, category: "Sweet", description: "Served with dark Caramel.", emoji: "🍮" },
    { id: 18, title: "Tiramisu", price: 10.00, category: "Sweet", description: "Classic coffee-flavoured dessert.", emoji: "🍰" },
    { id: 19, title: "Chocolate Cake", price: 11.00, category: "Sweet", description: "Served with French Vanilla ice cream.", emoji: "🍫" },
    { id: 20, title: "Almond Cake", price: 12.00, category: "Sweet", description: "Chef Felipe's special with berry coulis.", emoji: "🎂" },
];

const categories = [
    { id: "All", name: "ALL SYSTEM", icon: "💠" },
    { id: "Breakfast", name: "BREAKFAST", icon: "🍳" },
    { id: "Soup", name: "SOUPS", icon: "🥣" },
    { id: "Salad", name: "SALADS", icon: "🥗" },
    { id: "Main", name: "MAINS", icon: "🥩" },
    { id: "Sweet", name: "DESSERTS", icon: "🍰" }
];

let cart = [];
let currentCategory = 'All';
let searchQuery = '';
let orderCount = 1024;
let appliedCoupon = null;
let couponDiscount = 0;

document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderMenu();
    updateDateTime();
    
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            renderMenu();
        });
    }

    setInterval(updateDateTime, 1000);
});

function updateDateTime() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' });
    const timeStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const datetimeEl = document.getElementById('datetime');
    if (datetimeEl) {
        datetimeEl.innerText = `${dateStr} [${timeStr}]`;
    }
}

function renderCategories() {
    const container = document.getElementById('category-container');
    if (!container) return;
    
    container.innerHTML = categories.map(cat => `
        <button onclick="filterMenu('${cat.id}')" 
            class="px-6 py-3 rounded font-bold text-sm transition tracking-widest border border-slate-700
            ${currentCategory === cat.id 
                ? 'active-cat' 
                : 'bg-[#0f172a] text-slate-400 hover:text-cyan-400 hover:border-cyan-400'}">
            ${cat.icon} ${cat.name}
        </button>
    `).join('');
}

function filterMenu(catId) {
    currentCategory = catId;
    renderCategories();
    renderMenu();
}

function renderMenu() {
    const grid = document.getElementById('menu-grid');
    const noResults = document.getElementById('no-results');
    if (!grid) return;

    const filtered = products.filter(p => {
        const matchesCategory = currentCategory === 'All' || p.category === currentCategory;
        const matchesSearch = p.title.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = '';
        if (noResults) noResults.classList.remove('hidden');
        return;
    }
    
    if (noResults) noResults.classList.add('hidden');

    grid.innerHTML = filtered.map(product => `
        <div onclick="addToCart(${product.id})" class="neon-card bg-neon-card p-4 rounded border border-slate-700 cursor-pointer relative overflow-hidden group h-36 flex flex-col justify-between select-none">
            <div class="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-bl-full"></div>
            
            <div class="flex justify-between items-start z-10">
                <span class="text-3xl drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">${product.emoji}</span>
                <span class="font-mono text-cyan-400 font-bold text-lg drop-shadow-[0_0_3px_rgba(34,211,238,0.5)]">$${product.price}</span>
            </div>
            
            <div class="z-10">
                <h3 class="font-bold text-gray-100 text-sm uppercase tracking-wide leading-tight group-hover:text-cyan-300 transition">${product.title}</h3>
            </div>
        </div>
    `).join('');
}

function updateCartUI() {
    const container = document.getElementById('cart-items');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="h-full flex flex-col items-center justify-center text-slate-700 opacity-40">
                <span class="text-6xl mb-2 grayscale">🛒</span>
                <p class="titular tracking-widest">TERMINAL VACÍA</p>
            </div>`;
    } else {
        container.innerHTML = cart.map((item) => `
            <div class="flex justify-between items-center bg-[#0f172a] p-3 rounded border-l-2 border-cyan-500 shadow-lg animate-pulse-once">
                <div class="flex-1 pr-2">
                    <h4 class="font-bold text-sm text-cyan-100 uppercase tracking-wide">${item.title}</h4>
                    <p class="text-[10px] text-cyan-600 font-mono">$${item.price.toFixed(2)} x ${item.qty}</p>
                </div>
                <div class="flex items-center gap-3">
                    <p class="font-bold text-white font-mono">$${(item.price * item.qty).toFixed(2)}</p>
                    <div class="flex flex-col gap-1">
                        <button onclick="changeQty(${item.id}, 1)" class="w-6 h-6 bg-slate-800 rounded text-xs hover:bg-cyan-900 text-cyan-400 border border-slate-600 transition">+</button>
                        <button onclick="changeQty(${item.id}, -1)" class="w-6 h-6 bg-slate-800 rounded text-xs hover:bg-red-900/40 text-red-400 border border-slate-600 transition">-</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateCartTotals();
}

function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    // Recalculate discount if coupon is applied
    if (appliedCoupon) {
        const userId = getCurrentUserId();
        const result = CouponSystem.applyDiscount(appliedCoupon, subtotal, cart);
        couponDiscount = result.discount;
    } else {
        couponDiscount = 0;
    }
    
    const tax = subtotal * 0.16;
    const total = subtotal + tax - couponDiscount;

    updateElement('subtotal-display', formatMoney(subtotal));
    updateElement('tax-display', formatMoney(tax));
    
    // Show/hide discount line
    const totalsContainer = document.querySelector('.bg-[#0f172a] .space-y-2');
    let discountLine = document.getElementById('discount-line');
    
    if (appliedCoupon && couponDiscount > 0) {
        if (!discountLine) {
            discountLine = document.createElement('div');
            discountLine.id = 'discount-line';
            discountLine.className = 'flex justify-between text-sm font-mono';
            discountLine.style.cssText = 'color: #4ade80; font-weight: bold;';
            // Create two span elements for safe text insertion
            // Using textContent instead of innerHTML prevents XSS attacks by treating
            // the coupon code as plain text rather than executable HTML/JavaScript
            const labelSpan = document.createElement('span');
            const valueSpan = document.createElement('span');
            discountLine.appendChild(labelSpan);
            discountLine.appendChild(valueSpan);
            // Insert before the TOTAL line
            const totalLine = totalsContainer.querySelector('.border-t');
            totalsContainer.insertBefore(discountLine, totalLine);
        }
        // Safely set text content (XSS prevention)
        const spans = discountLine.querySelectorAll('span');
        if (spans.length >= 2) {
            spans[0].textContent = `DESCUENTO (${appliedCoupon.code})`;
            spans[1].textContent = `-${formatMoney(couponDiscount)}`;
        }
    } else {
        if (discountLine) discountLine.remove();
    }
    
    updateElement('total-display', formatMoney(total));
    updateElement('btn-total', formatMoney(total));
    updateElement('modal-total', formatMoney(total));
}

function updateElement(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(c => c.id === id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
}

function changeQty(id, delta) {
    const itemIndex = cart.findIndex(c => c.id === id);
    if (itemIndex === -1) return;
    cart[itemIndex].qty += delta;
    if (cart[itemIndex].qty <= 0) {
        cart.splice(itemIndex, 1);
    }
    updateCartUI();
}

function clearCart() {
    if (cart.length > 0 && confirm('¿RESET SYSTEM DATA?')) {
        cart = [];
        appliedCoupon = null;
        couponDiscount = 0;
        document.getElementById('applied-coupon').style.display = 'none';
        updateCartUI();
    }
}

function openCheckout() {
    if (cart.length === 0) return;
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeCheckout() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function processPayment(method) {
    const total = document.getElementById('total-display')?.innerText || '$0.00';
    const userId = getCurrentUserId();
    
    // Registrar uso del cupón
    if (appliedCoupon) {
        CouponSystem.recordCouponUse(userId, appliedCoupon.code);
        
        // Si es cupón de referido, dar crédito al referidor
        if (appliedCoupon.referralBonus) {
            console.log(`Bonus de $${appliedCoupon.referralBonus} acreditado al referidor`);
        }
    }
    
    // Incrementar contador de órdenes
    const currentOrderCount = parseInt(localStorage.getItem(`orders_${userId}`) || '0');
    localStorage.setItem(`orders_${userId}`, (currentOrderCount + 1).toString());
    
    const couponInfo = appliedCoupon ? `\nCupón usado: ${appliedCoupon.code}\nDescuento: $${couponDiscount.toFixed(2)}` : '';
    
    alert(`⚡ TRANSACTION APPROVED ⚡\n\nMethod: ${method}\nTotal: ${total}${couponInfo}`);
    
    // Resetear
    cart = [];
    appliedCoupon = null;
    couponDiscount = 0;
    orderCount++;
    updateElement('order-id', orderCount);
    closeCheckout();
    updateCartUI();
}

function formatMoney(amount) {
    return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// ============= COUPON SYSTEM FUNCTIONS =============

/**
 * Get the current user ID for coupon tracking
 * @returns {string} User ID from AuthService or 'guest'
 */
function getCurrentUserId() {
    return typeof AuthService !== 'undefined' ? (AuthService.getCurrentUser() || 'guest') : 'guest';
}

function applyCoupon() {
    const code = document.getElementById('coupon-input').value.trim();
    const userId = getCurrentUserId();
    const cartTotal = calculateCartTotal();
    
    if (!code) {
        showCouponMessage('Por favor ingresa un código de cupón', 'error');
        return;
    }

    const validation = CouponSystem.validateCoupon(code, userId, cartTotal, getUserBirthMonth());
    
    if (!validation.valid) {
        showCouponMessage(validation.message, 'error');
        return;
    }

    const result = CouponSystem.applyDiscount(validation.coupon, cartTotal, cart);
    
    appliedCoupon = { code: code.toUpperCase(), ...validation.coupon };
    couponDiscount = result.discount;
    
    // Mostrar cupón aplicado
    document.getElementById('applied-coupon').style.display = 'flex';
    const couponCodeEl = document.getElementById('applied-coupon-code');
    couponCodeEl.textContent = `${code.toUpperCase()} (-$${result.discount.toFixed(2)})`;
    
    showCouponMessage(result.message, 'success');
    updateCartTotals();
    
    // Limpiar input
    document.getElementById('coupon-input').value = '';
}

function removeCoupon() {
    appliedCoupon = null;
    couponDiscount = 0;
    document.getElementById('applied-coupon').style.display = 'none';
    showCouponMessage('Cupón removido', 'info');
    updateCartTotals();
}

function showCouponMessage(message, type) {
    const messageEl = document.getElementById('coupon-message');
    messageEl.style.display = 'block';
    messageEl.textContent = message;
    
    const colors = {
        success: { bg: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', border: '1px solid #22c55e' },
        error: { bg: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444' },
        info: { bg: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid #3b82f6' }
    };
    
    messageEl.style.background = colors[type].bg;
    messageEl.style.color = colors[type].color;
    messageEl.style.border = colors[type].border;
    
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 5000);
}

function showAvailableCoupons() {
    const userId = getCurrentUserId();
    const availableCoupons = CouponSystem.getAvailableCoupons(userId, getUserBirthMonth());
    
    const listEl = document.getElementById('coupons-list');
    
    if (availableCoupons.length === 0) {
        listEl.innerHTML = '<p style="text-align: center; color: #64748b; padding: 2rem; font-size: 0.9rem;">No tienes cupones disponibles en este momento 😔</p>';
    } else {
        listEl.innerHTML = availableCoupons.map(coupon => {
            const badgeText = coupon.type === 'percentage' 
                ? `${coupon.value}% OFF` 
                : coupon.type === 'fixed' 
                    ? `$${coupon.value} OFF`
                    : coupon.type === 'combo'
                        ? `${coupon.discount}% OFF + GRATIS`
                        : `${coupon.value}% OFF`;
            
            return `
                <div class="coupon-card" style="border: 2px solid #06b6d4; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; position: relative; overflow: hidden; background: #0a101f;">
                    <div style="position: absolute; top: 10px; right: 10px; background: #ffd700; color: #000; padding: 0.25rem 0.75rem; border-radius: 20px; font-weight: bold; font-size: 0.75rem;">
                        ${badgeText}
                    </div>
                    <h4 style="color: #22d3ee; margin-bottom: 0.5rem; font-size: 1.1rem; font-weight: bold; letter-spacing: 0.05em;">${coupon.code}</h4>
                    <p style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 0.75rem; line-height: 1.4;">${coupon.description}</p>
                    ${coupon.minPurchase ? `<small style="color: #64748b; display: block; margin-bottom: 0.25rem;">Compra mínima: $${coupon.minPurchase}</small>` : ''}
                    ${coupon.validUntil ? `<small style="display: block; color: #64748b;">Válido hasta: ${new Date(coupon.validUntil).toLocaleDateString('es-MX')}</small>` : ''}
                    <button 
                        onclick="useCoupon('${coupon.code}')" 
                        style="width: 100%; margin-top: 0.75rem; padding: 0.5rem; background: #06b6d4; color: #000; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.85rem;"
                        onmouseover="this.style.background='#22d3ee'" 
                        onmouseout="this.style.background='#06b6d4'"
                    >
                        USAR AHORA
                    </button>
                </div>
            `;
        }).join('');
    }
    
    document.getElementById('coupons-modal').style.display = 'block';
}

function closeCouponsModal() {
    document.getElementById('coupons-modal').style.display = 'none';
}

function useCoupon(code) {
    document.getElementById('coupon-input').value = code;
    closeCouponsModal();
    applyCoupon();
}

function getUserBirthMonth() {
    // Obtener del perfil del usuario o localStorage
    return parseInt(localStorage.getItem('userBirthMonth') || '0');
}

function calculateCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}
