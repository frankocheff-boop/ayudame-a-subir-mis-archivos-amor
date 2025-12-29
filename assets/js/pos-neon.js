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
    // ESPECIALIDADES DEL CHEF
    { id: 100, title: "Camarón al Azafrán con Ravioli", price: 495.00, category: "Chef Signature", description: "Fusión de mar y tierra con toques mediterráneos", emoji: "⭐", image: "../assets/images/menu/especialidades/camaron-ravioli-gourmet.svg", signature: true },
    { id: 101, title: "Esfera de Mango Molecular", price: 285.00, category: "Chef Signature", description: "Postre artístico con técnicas moleculares", emoji: "✨", image: "../assets/images/menu/especialidades/postre-esferico-molecular.svg", signature: true },
    { id: 102, title: "Ravioli Artesanal Multi-Salsas", price: 425.00, category: "Chef Signature", description: "Pasta fresca con armonía de salsas gourmet", emoji: "🌟", image: "../assets/images/menu/especialidades/ravioli-artesanal-salsas.svg", signature: true }
];

const categories = [
    { id: "All", name: "ALL SYSTEM", icon: "💠" },
    { id: "Chef Signature", name: "CHEF SIGNATURE", icon: "👨‍🍳" },
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

    grid.innerHTML = filtered.map(product => {
        const isSignature = product.signature === true;
        const cardHeight = isSignature ? 'h-48' : 'h-36';
        
        if (isSignature && product.image) {
            // Signature dish card with image
            return `
                <div onclick="addToCart(${product.id})" class="neon-card bg-neon-card p-4 rounded border-2 border-yellow-500/50 cursor-pointer relative overflow-hidden group ${cardHeight} flex flex-col justify-between select-none hover:border-yellow-400 transition">
                    <div class="absolute top-0 right-0 px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-[10px] font-bold tracking-wider">
                        ✨ SIGNATURE
                    </div>
                    
                    <div class="flex gap-3 z-10 flex-1">
                        <div class="w-20 h-20 rounded overflow-hidden flex-shrink-0 border-2 border-yellow-500/30">
                            <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover">
                        </div>
                        <div class="flex-1 flex flex-col justify-between">
                            <div>
                                <h3 class="font-bold text-yellow-300 text-sm uppercase tracking-wide leading-tight mb-1">${product.title}</h3>
                                <p class="text-[10px] text-slate-400 line-clamp-2">${product.description}</p>
                            </div>
                            <span class="font-mono text-yellow-400 font-bold text-xl drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">$${product.price}</span>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Regular product card with emoji
            return `
                <div onclick="addToCart(${product.id})" class="neon-card bg-neon-card p-4 rounded border border-slate-700 cursor-pointer relative overflow-hidden group ${cardHeight} flex flex-col justify-between select-none">
                    <div class="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-bl-full"></div>
                    
                    <div class="flex justify-between items-start z-10">
                        <span class="text-3xl drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">${product.emoji}</span>
                        <span class="font-mono text-cyan-400 font-bold text-lg drop-shadow-[0_0_3px_rgba(34,211,238,0.5)]">$${product.price}</span>
                    </div>
                    
                    <div class="z-10">
                        <h3 class="font-bold text-gray-100 text-sm uppercase tracking-wide leading-tight group-hover:text-cyan-300 transition">${product.title}</h3>
                    </div>
                </div>
            `;
        }
    }).join('');
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

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = subtotal * 0.16;
    const total = subtotal + tax;

    updateElement('subtotal-display', formatMoney(subtotal));
    updateElement('tax-display', formatMoney(tax));
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
    alert(`⚡ TRANSACTION APPROVED ⚡\n\nMethod: ${method}\nTotal: ${total}`);
    cart = [];
    orderCount++;
    updateElement('order-id', orderCount);
    closeCheckout();
    updateCartUI();
}

function formatMoney(amount) {
    return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}
