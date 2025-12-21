// POS Restaurant - JavaScript
// Sistema de punto de venta estilo restaurant profesional

const products = [
    { id: 1, name: "Breakfast por persona", price: 120, category: "food", emoji: "🍔" },
    { id: 2, name: "Lunch por persona", price: 180, category: "food", emoji: "🍕" },
    { id: 3, name: "Cenas gourmet 3 tiempos", price: 595, category: "food", emoji: "🌮" },
    { id: 4, name: "Barra libre gold", price: 110, category: "food", emoji: "🥗" },
    { id: 5, name: "Papas Fritas", price: 60, category: "sides", emoji: "🍟" },
    { id: 6, name: "Coca Cola", price: 35, category: "drinks", emoji: "🥤" },
    { id: 7, name: "Cerveza Artesanal", price: 80, category: "drinks", emoji: "🍺" },
    { id: 8, name: "Aguas Frescas", price: 40, category: "drinks", emoji: "🧃" },
    { id: 9, name: "Desayunos premium", price: 285, category: "dessert", emoji: "🍰" },
    { id: 10, name: "Café último día", price: 45, category: "drinks", emoji: "☕" },
];

const categories = [
    { id: "all", name: "Todos", icon: "🍽️" },
    { id: "food", name: "Comida", icon: "🥘" },
    { id: "drinks", name: "Bebidas", icon: "🥤" },
    { id: "sides", name: "Extras", icon: "🍟" },
    { id: "dessert", name: "Postres", icon: "🍰" }
];

let cart = [];
let currentCategory = 'all';
let orderCount = 1;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderMenu();
    updateDateTime();
    setInterval(updateDateTime, 1000);
});

function updateDateTime() {
    const el = document.getElementById('datetime');
    if (el) {
        const now = new Date();
        el.innerText = now.toLocaleDateString('es-MX', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Renderizado
function renderCategories() {
    const container = document.getElementById('category-container');
    if (!container) return;
    
    container.innerHTML = categories.map(cat => `
        <button onclick="filterMenu('${cat.id}')" 
            class="px-4 py-2 rounded-lg font-semibold text-sm transition 
            ${currentCategory === cat.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-200'}">
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
    if (!grid) return;
    
    const filtered = currentCategory === 'all'
        ? products
        : products.filter(p => p.category === currentCategory);

    grid.innerHTML = filtered.map(product => `
        <div onclick="addToCart(${product.id})" class="dish-card bg-white p-4 rounded-2xl shadow hover:shadow-lg cursor-pointer transition duration-200 border border-transparent hover:border-indigo-300 flex flex-col items-center text-center h-48 justify-between select-none">
            <div class="text-5xl mb-2 transform transition hover:scale-110">${product.emoji}</div>
            <div>
                <h3 class="font-bold text-gray-800 leading-tight mb-1">${product.name}</h3>
                <p class="text-indigo-600 font-extrabold">$${product.price.toFixed(2)}</p>
            </div>
        </div>
    `).join('');
}

function updateCartUI() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                <span class="text-6xl mb-2">🛒</span>
                <p>Orden vacía</p>
            </div>`;
    } else {
        container.innerHTML = cart.map((item, index) => `
            <div class="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100 animate-fadeIn">
                <div class="flex-1">
                    <h4 class="font-bold text-sm text-gray-800">${item.name}</h4>
                    <p class="text-xs text-gray-500">$${item.price} x ${item.qty}</p>
                </div>
                <div class="flex items-center gap-3">
                    <p class="font-bold text-gray-800">$${(item.price * item.qty).toFixed(2)}</p>
                    <div class="flex flex-col gap-1">
                        <button onclick="changeQty(${item.id}, 1)" class="w-6 h-6 bg-gray-200 rounded text-xs hover:bg-green-200 text-green-700 font-bold">+</button>
                        <button onclick="changeQty(${item.id}, -1)" class="w-6 h-6 bg-gray-200 rounded text-xs hover:bg-red-200 text-red-700 font-bold">-</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Calcular totales
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

// Lógica del carrito
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
    if (confirm('¿Estás seguro de borrar la orden actual?')) {
        cart = [];
        updateCartUI();
    }
}

// Proceso de pago
function openCheckout() {
    if (cart.length === 0) {
        alert("El carrito está vacío.");
        return;
    }
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

    alert(`✅ PAGO APROBADO\n\nMétodo: ${method}\nTotal: ${total}\n\n¡Imprimiendo recibo!`);

    // Resetear para la siguiente orden
    cart = [];
    orderCount++;
    updateElement('order-id', orderCount.toString().padStart(3, '0'));
    closeCheckout();
    updateCartUI();
}

function formatMoney(amount) {
    return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}
