// Guest Form JavaScript - VERANO ESTATE
// Funcionalidad completa del formulario de huéspedes

// Estado del formulario
let guestsList = [];
let servicesPrices = {
    breakfast: 120,
    lunch: 180,
    dinner: 595,
    openBar: 110
};

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    loadFormData();
    setupEventListeners();
});

function initializeForm() {
    // Cargar datos guardados si existen
    const savedData = loadFormData();
    if (savedData) {
        populateFormWithSavedData(savedData);
    }
}

function setupEventListeners() {
    // Auto-guardar en cada cambio
    const form = document.getElementById('guestForm');
    if (form) {
        form.addEventListener('input', debounce(saveFormData, 500));
        form.addEventListener('change', saveFormData);
    }

    // Botón de agregar huésped
    const addGuestBtn = document.getElementById('addGuestBtn');
    if (addGuestBtn) {
        addGuestBtn.addEventListener('click', addGuestRow);
    }

    // Botón de limpiar formulario
    const clearBtn = document.getElementById('clearFormBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearFormData);
    }

    // Botón de WhatsApp
    const whatsappBtn = document.getElementById('whatsappBtn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', sendToWhatsApp);
    }

    // Checkboxes de servicios
    document.querySelectorAll('input[name="services"]').forEach(checkbox => {
        checkbox.addEventListener('change', calculateServices);
    });
}

// ==================== GESTIÓN DE DATOS ====================
function loadFormData() {
    try {
        const savedData = localStorage.getItem('veranoEstateFormData');
        return savedData ? JSON.parse(savedData) : null;
    } catch (error) {
        console.error('Error loading form data:', error);
        return null;
    }
}

function saveFormData() {
    try {
        const formData = new FormData(document.getElementById('guestForm'));
        const data = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            checkIn: formData.get('checkIn'),
            checkOut: formData.get('checkOut'),
            guests: guestsList,
            services: getSelectedServices(),
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('veranoEstateFormData', JSON.stringify(data));
    } catch (error) {
        console.error('Error saving form data:', error);
    }
}

function clearFormData() {
    if (confirm(i18n.t('form.confirmClear') || '¿Está seguro de que desea limpiar el formulario?')) {
        localStorage.removeItem('veranoEstateFormData');
        document.getElementById('guestForm').reset();
        guestsList = [];
        updateGuestTable();
        calculateServices();
        showToast('Formulario limpiado exitosamente', 'success');
    }
}

function populateFormWithSavedData(data) {
    if (data.fullName) document.getElementById('fullName').value = data.fullName;
    if (data.email) document.getElementById('email').value = data.email;
    if (data.phone) document.getElementById('phone').value = data.phone;
    if (data.checkIn) document.getElementById('checkIn').value = data.checkIn;
    if (data.checkOut) document.getElementById('checkOut').value = data.checkOut;
    if (data.guests) {
        guestsList = data.guests;
        updateGuestTable();
    }
    if (data.services) {
        data.services.forEach(service => {
            const checkbox = document.querySelector(`input[name="services"][value="${service}"]`);
            if (checkbox) checkbox.checked = true;
        });
        calculateServices();
    }
}

// ==================== VALIDACIÓN ====================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    // Acepta formatos internacionales
    const re = /^[\d\s\+\-\(\)]{10,}$/;
    return re.test(phone);
}

function validateForm() {
    clearErrors();
    let isValid = true;

    // Validar nombre
    const fullName = document.getElementById('fullName');
    if (!fullName.value.trim()) {
        showError('fullName', i18n.t('validation.required'));
        isValid = false;
    }

    // Validar email
    const email = document.getElementById('email');
    if (!email.value.trim()) {
        showError('email', i18n.t('validation.required'));
        isValid = false;
    } else if (!validateEmail(email.value)) {
        showError('email', i18n.t('validation.invalidEmail'));
        isValid = false;
    }

    // Validar teléfono
    const phone = document.getElementById('phone');
    if (!phone.value.trim()) {
        showError('phone', i18n.t('validation.required'));
        isValid = false;
    } else if (!validatePhone(phone.value)) {
        showError('phone', i18n.t('validation.invalidPhone'));
        isValid = false;
    }

    // Validar fechas
    const checkIn = document.getElementById('checkIn');
    const checkOut = document.getElementById('checkOut');
    if (!checkIn.value) {
        showError('checkIn', i18n.t('validation.required'));
        isValid = false;
    }
    if (!checkOut.value) {
        showError('checkOut', i18n.t('validation.required'));
        isValid = false;
    }
    if (checkIn.value && checkOut.value && new Date(checkIn.value) >= new Date(checkOut.value)) {
        showError('checkOut', 'La fecha de salida debe ser posterior a la fecha de entrada');
        isValid = false;
    }

    return isValid;
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    // Agregar clase de error
    field.classList.add('border-red-500');

    // Crear elemento de error si no existe
    let errorDiv = field.parentElement.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        field.parentElement.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.border-red-500').forEach(el => {
        el.classList.remove('border-red-500');
    });
}

// ==================== GESTIÓN DE HUÉSPEDES ====================
function addGuestRow() {
    const guestName = document.getElementById('guestName')?.value.trim();
    const roomNumber = document.getElementById('roomNumber')?.value;
    const adults = parseInt(document.getElementById('guestAdults')?.value) || 1;
    const children = parseInt(document.getElementById('guestChildren')?.value) || 0;

    if (!guestName) {
        showToast('Por favor ingrese el nombre del huésped', 'error');
        return;
    }

    if (!roomNumber) {
        showToast('Por favor seleccione una habitación', 'error');
        return;
    }

    const guest = {
        id: Date.now(),
        name: guestName,
        room: roomNumber,
        adults: adults,
        children: children
    };

    guestsList.push(guest);
    updateGuestTable();
    saveFormData();

    // Limpiar campos
    document.getElementById('guestName').value = '';
    document.getElementById('guestAdults').value = '1';
    document.getElementById('guestChildren').value = '0';
}

function removeGuestRow(guestId) {
    guestsList = guestsList.filter(g => g.id !== guestId);
    updateGuestTable();
    saveFormData();
}

function updateGuestTable() {
    const tableBody = document.getElementById('guestsTableBody');
    if (!tableBody) return;

    if (guestsList.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-gray-500">No hay huéspedes agregados</td></tr>';
        document.getElementById('totalGuests').textContent = '0';
        return;
    }

    tableBody.innerHTML = guestsList.map(guest => `
        <tr class="guest-row">
            <td class="px-4 py-3 border-t">${guest.room}</td>
            <td class="px-4 py-3 border-t">${guest.name}</td>
            <td class="px-4 py-3 border-t text-center">${guest.adults}</td>
            <td class="px-4 py-3 border-t text-center">${guest.children}</td>
            <td class="px-4 py-3 border-t text-center">
                <button onclick="removeGuestRow(${guest.id})" class="text-red-600 hover:text-red-800">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </td>
        </tr>
    `).join('');

    // Actualizar total de personas
    const totalAdults = guestsList.reduce((sum, g) => sum + g.adults, 0);
    const totalChildren = guestsList.reduce((sum, g) => sum + g.children, 0);
    document.getElementById('totalGuests').textContent = `${totalAdults + totalChildren} (${totalAdults}A, ${totalChildren}N)`;
}

// ==================== SERVICIOS ADICIONALES ====================
function getSelectedServices() {
    const services = [];
    document.querySelectorAll('input[name="services"]:checked').forEach(checkbox => {
        services.push(checkbox.value);
    });
    return services;
}

function calculateServices() {
    const selectedServices = getSelectedServices();
    const totalGuests = guestsList.reduce((sum, g) => sum + g.adults, 0);
    
    let totalCost = 0;
    const summary = [];

    selectedServices.forEach(service => {
        const price = servicesPrices[service] || 0;
        const cost = price * totalGuests;
        totalCost += cost;
        
        const serviceName = {
            breakfast: 'Desayuno',
            lunch: 'Comida',
            dinner: 'Cena Premium',
            openBar: 'Barra Libre'
        }[service] || service;

        summary.push(`${serviceName}: $${price} x ${totalGuests} = $${cost.toFixed(2)}`);
    });

    updateServicesSummary(summary, totalCost);
}

function updateServicesSummary(summary, total) {
    const summaryDiv = document.getElementById('servicesSummary');
    if (!summaryDiv) return;

    if (summary.length === 0) {
        summaryDiv.innerHTML = '<p class="text-gray-500">No hay servicios seleccionados</p>';
        return;
    }

    summaryDiv.innerHTML = `
        <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">Resumen de Servicios:</h4>
            ${summary.map(item => `<div class="service-item">${item}</div>`).join('')}
            <div class="mt-3 pt-3 border-t border-gray-300 font-bold text-lg">
                Total: $${total.toFixed(2)} MXN
            </div>
        </div>
    `;
}

// ==================== WHATSAPP ====================
function generateWhatsAppMessage() {
    const formData = new FormData(document.getElementById('guestForm'));
    
    let message = '🏨 *VERANO ESTATE - Nueva Reservación*\n\n';
    
    // Información de contacto
    message += '👤 *Datos del Contacto:*\n';
    message += `Nombre: ${formData.get('fullName')}\n`;
    message += `Email: ${formData.get('email')}\n`;
    message += `Teléfono: ${formData.get('phone')}\n\n`;
    
    // Fechas
    message += '📅 *Fechas:*\n';
    message += `Check-in: ${formData.get('checkIn')}\n`;
    message += `Check-out: ${formData.get('checkOut')}\n\n`;
    
    // Asignación de habitaciones
    if (guestsList.length > 0) {
        message += '🛏️ *Asignación de Habitaciones:*\n';
        guestsList.forEach(guest => {
            message += `• Habitación ${guest.room} - ${guest.name} (${guest.adults}A, ${guest.children}N)\n`;
        });
        message += '\n';
    }
    
    // Servicios solicitados
    const selectedServices = getSelectedServices();
    if (selectedServices.length > 0) {
        message += '🍽️ *Servicios Solicitados:*\n';
        const totalGuests = guestsList.reduce((sum, g) => sum + g.adults, 0);
        let totalCost = 0;
        
        selectedServices.forEach(service => {
            const price = servicesPrices[service] || 0;
            const cost = price * totalGuests;
            totalCost += cost;
            
            const serviceName = {
                breakfast: 'Desayuno',
                lunch: 'Comida',
                dinner: 'Cena Premium',
                openBar: 'Barra Libre'
            }[service] || service;
            
            message += `• ${serviceName}: $${price} x ${totalGuests} = $${cost.toFixed(2)}\n`;
        });
        
        message += `\n💰 *Total de Servicios:* $${totalCost.toFixed(2)} MXN\n\n`;
    }
    
    message += '---\n';
    message += 'Enviado desde el formulario web de VERANO ESTATE';
    
    return message;
}

function sendToWhatsApp(event) {
    if (event) event.preventDefault();
    
    // Validar formulario
    if (!validateForm()) {
        showToast('Por favor complete todos los campos requeridos correctamente', 'error');
        return;
    }
    
    if (guestsList.length === 0) {
        showToast('Por favor agregue al menos un huésped', 'error');
        return;
    }
    
    const message = generateWhatsAppMessage();
    const phoneNumber = '523221606843'; // +52 322 160 6843
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Abrir WhatsApp en nueva ventana
    window.open(whatsappUrl, '_blank');
    
    // Opcional: Limpiar formulario después de enviar
    setTimeout(() => {
        if (confirm('¿Desea limpiar el formulario?')) {
            clearFormData();
        }
    }, 1000);
}

// ==================== UTILIDADES ====================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showToast(message, type = 'success') {
    // Remover toast anterior si existe
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Crear nuevo toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="flex items-center">
            <span class="mr-2">${type === 'success' ? '✓' : '✗'}</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Agregar animación de salida
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
