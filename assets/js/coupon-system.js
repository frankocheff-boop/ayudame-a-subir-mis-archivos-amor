// VERANO ESTATE - Sistema de Cupones y Descuentos
// Sistema completo de cupones, descuentos y programa de lealtad

class CouponSystem {
    constructor() {
        this.coupons = this.initializeCoupons();
        this.loyaltyLevels = this.initializeLoyaltyLevels();
        this.userCoupons = this.loadUserCoupons();
        this.userPoints = this.loadUserPoints();
        this.couponUsage = this.loadCouponUsage();
    }

    // Inicializar base de datos de cupones
    initializeCoupons() {
        return {
            // Cupón de Bienvenida
            'FRANKO15': {
                code: 'FRANKO15',
                name: 'Cupón de Bienvenida',
                description: '15% de descuento en tu primera orden',
                type: 'percentage',
                value: 15,
                minPurchase: 500,
                maxUses: 1,
                validDays: 30,
                category: 'welcome',
                emoji: '🎉',
                newUsersOnly: true
            },
            
            // Cupón de Cumpleaños
            'BIRTHDAYCHEF': {
                code: 'BIRTHDAYCHEF',
                name: 'Cumpleaños del Chef',
                description: 'Postre signature gratis + 20% descuento',
                type: 'combo',
                value: 20,
                freeItem: 'dessert',
                minPurchase: 0,
                maxUses: 1,
                category: 'birthday',
                emoji: '🎂',
                birthdayMonth: true
            },
            
            // Cupones Estacionales
            'VERANO2025': {
                code: 'VERANO2025',
                name: 'Verano Tropical',
                description: '25% OFF en bebidas tropicales',
                type: 'category',
                value: 25,
                appliesTo: ['Bebidas', 'Drinks'],
                minPurchase: 200,
                maxUses: 999,
                expiryDate: '2025-09-30',
                category: 'seasonal',
                emoji: '🍹'
            },
            
            'NAVIDAD2024': {
                code: 'NAVIDAD2024',
                name: 'Navidad Especial',
                description: '30% OFF en cena completa para 2',
                type: 'percentage',
                value: 30,
                minPurchase: 1000,
                maxUses: 999,
                expiryDate: '2024-12-31',
                category: 'seasonal',
                emoji: '🎄'
            },
            
            'AMOR2025': {
                code: 'AMOR2025',
                name: 'Menú Romántico',
                description: 'Menú romántico 2x1',
                type: 'buy_one_get_one',
                value: 50,
                appliesTo: ['Main', 'Sweet'],
                minPurchase: 500,
                maxUses: 999,
                expiryDate: '2025-02-28',
                category: 'seasonal',
                emoji: '❤️'
            },
            
            'MEXICO2025': {
                code: 'MEXICO2025',
                name: 'Sabor Mexicano',
                description: '15% OFF en platillos mexicanos',
                type: 'category',
                value: 15,
                appliesTo: ['Mexican', 'Breakfast'],
                minPurchase: 300,
                maxUses: 999,
                expiryDate: '2025-12-31',
                category: 'seasonal',
                emoji: '🇲🇽'
            }
        };
    }

    // Inicializar niveles de lealtad
    initializeLoyaltyLevels() {
        return {
            'BRONCE': {
                name: 'Bronce',
                minPoints: 0,
                maxPoints: 500,
                discount: 5,
                emoji: '🥉',
                color: '#cd7f32'
            },
            'PLATA': {
                name: 'Plata',
                minPoints: 501,
                maxPoints: 1500,
                discount: 10,
                emoji: '🥈',
                color: '#c0c0c0'
            },
            'ORO': {
                name: 'Oro',
                minPoints: 1501,
                maxPoints: 3000,
                discount: 15,
                emoji: '🥇',
                color: '#ffd700'
            },
            'PLATINO': {
                name: 'Platino',
                minPoints: 3001,
                maxPoints: Infinity,
                discount: 20,
                emoji: '💎',
                color: '#e5e4e2'
            }
        };
    }

    // Generar código de referido único
    generateReferralCode(userId) {
        return `FRANKO-${userId}`;
    }

    // Validar cupón
    validateCoupon(code, userId, cartTotal, cart = []) {
        const coupon = this.coupons[code.toUpperCase()];
        
        if (!coupon) {
            return {
                valid: false,
                error: 'Cupón no válido',
                message: '❌ El código ingresado no existe'
            };
        }

        // Verificar fecha de expiración
        if (coupon.expiryDate) {
            const expiryDate = new Date(coupon.expiryDate);
            const today = new Date();
            if (today > expiryDate) {
                return {
                    valid: false,
                    error: 'Cupón expirado',
                    message: '❌ Este cupón ya no es válido'
                };
            }
        }

        // Verificar mínimo de compra
        if (cartTotal < coupon.minPurchase) {
            return {
                valid: false,
                error: 'Mínimo no alcanzado',
                message: `❌ Compra mínima requerida: $${coupon.minPurchase} MXN`
            };
        }

        // Verificar máximo de usos
        const usageCount = this.getCouponUsageCount(code, userId);
        if (usageCount >= coupon.maxUses) {
            return {
                valid: false,
                error: 'Límite de uso excedido',
                message: '❌ Has alcanzado el límite de uso para este cupón'
            };
        }

        // Verificar si es solo para nuevos usuarios
        if (coupon.newUsersOnly) {
            const isNewUser = this.isNewUser(userId);
            if (!isNewUser) {
                return {
                    valid: false,
                    error: 'Solo para nuevos usuarios',
                    message: '❌ Este cupón es solo para clientes nuevos'
                };
            }
        }

        // Verificar mes de cumpleaños
        if (coupon.birthdayMonth) {
            const isBirthdayMonth = this.isBirthdayMonth(userId);
            if (!isBirthdayMonth) {
                return {
                    valid: false,
                    error: 'Solo en mes de cumpleaños',
                    message: '❌ Este cupón es válido solo en tu mes de cumpleaños'
                };
            }
        }

        // Cupón válido
        return {
            valid: true,
            coupon: coupon,
            message: `✅ ${coupon.emoji} ${coupon.name} aplicado con éxito`
        };
    }

    // Aplicar descuento
    applyDiscount(coupon, cartTotal, cart = []) {
        let discount = 0;
        let freeItems = [];
        let discountDetails = {
            type: coupon.type,
            originalTotal: cartTotal,
            discount: 0,
            finalTotal: cartTotal,
            freeItems: [],
            message: ''
        };

        switch (coupon.type) {
            case 'percentage':
                discount = (cartTotal * coupon.value) / 100;
                discountDetails.discount = discount;
                discountDetails.finalTotal = cartTotal - discount;
                discountDetails.message = `${coupon.value}% de descuento aplicado`;
                break;

            case 'fixed':
                discount = coupon.value;
                discountDetails.discount = discount;
                discountDetails.finalTotal = Math.max(0, cartTotal - discount);
                discountDetails.message = `$${coupon.value} MXN de descuento aplicado`;
                break;

            case 'category':
                // Calcular descuento solo en items de categorías específicas
                const categoryTotal = cart
                    .filter(item => coupon.appliesTo.includes(item.category))
                    .reduce((sum, item) => sum + (item.price * item.qty), 0);
                discount = (categoryTotal * coupon.value) / 100;
                discountDetails.discount = discount;
                discountDetails.finalTotal = cartTotal - discount;
                discountDetails.message = `${coupon.value}% descuento en ${coupon.appliesTo.join(', ')}`;
                break;

            case 'combo':
                // Descuento porcentaje + item gratis
                discount = (cartTotal * coupon.value) / 100;
                discountDetails.discount = discount;
                discountDetails.finalTotal = cartTotal - discount;
                discountDetails.freeItems = [coupon.freeItem];
                discountDetails.message = `${coupon.value}% descuento + ${coupon.freeItem} gratis`;
                break;

            case 'buy_one_get_one':
                // 2x1 en categorías específicas
                const bogo_items = cart.filter(item => 
                    coupon.appliesTo.includes(item.category)
                );
                // Descuento del 50% en items aplicables
                const bogoTotal = bogo_items.reduce((sum, item) => 
                    sum + (item.price * item.qty), 0
                );
                discount = bogoTotal * 0.5;
                discountDetails.discount = discount;
                discountDetails.finalTotal = cartTotal - discount;
                discountDetails.message = '2x1 en platillos seleccionados';
                break;
        }

        return discountDetails;
    }

    // Calcular puntos de lealtad
    calculateLoyaltyPoints(amount, action = 'purchase') {
        let points = 0;
        
        switch (action) {
            case 'purchase':
                points = Math.floor(amount); // $1 MXN = 1 punto
                break;
            case 'referral':
                points = 200;
                break;
            case 'review':
                points = 50;
                break;
            case 'share':
                points = 25;
                break;
        }

        return points;
    }

    // Obtener nivel de lealtad actual
    getCurrentLoyaltyLevel(userId) {
        const points = this.getUserPoints(userId);
        
        for (const [level, data] of Object.entries(this.loyaltyLevels)) {
            if (points >= data.minPoints && points <= data.maxPoints) {
                return {
                    level: level,
                    ...data,
                    currentPoints: points,
                    nextLevelPoints: data.maxPoints === Infinity ? null : data.maxPoints + 1,
                    pointsToNext: data.maxPoints === Infinity ? 0 : (data.maxPoints + 1) - points
                };
            }
        }

        return null;
    }

    // Agregar puntos al usuario
    addPointsToUser(userId, points, source = 'purchase') {
        const currentPoints = this.getUserPoints(userId);
        const newPoints = currentPoints + points;
        
        this.userPoints[userId] = newPoints;
        this.saveUserPoints();
        
        return {
            previousPoints: currentPoints,
            pointsAdded: points,
            newPoints: newPoints,
            source: source
        };
    }

    // Obtener cupones disponibles para usuario
    getAvailableCoupons(userId) {
        const available = [];
        
        for (const [code, coupon] of Object.entries(this.coupons)) {
            const usageCount = this.getCouponUsageCount(code, userId);
            
            // Verificar si está disponible
            if (usageCount < coupon.maxUses) {
                // Verificar fecha de expiración
                if (!coupon.expiryDate || new Date(coupon.expiryDate) > new Date()) {
                    // Verificar requisitos especiales
                    let available_flag = true;
                    
                    if (coupon.newUsersOnly && !this.isNewUser(userId)) {
                        available_flag = false;
                    }
                    
                    if (coupon.birthdayMonth && !this.isBirthdayMonth(userId)) {
                        available_flag = false;
                    }
                    
                    if (available_flag) {
                        available.push({
                            ...coupon,
                            usesRemaining: coupon.maxUses - usageCount,
                            isNew: usageCount === 0
                        });
                    }
                }
            }
        }
        
        return available;
    }

    // Marcar cupón como usado
    markCouponAsUsed(code, userId, orderTotal) {
        const key = `${userId}_${code}`;
        
        if (!this.couponUsage[key]) {
            this.couponUsage[key] = [];
        }
        
        this.couponUsage[key].push({
            date: new Date().toISOString(),
            orderTotal: orderTotal,
            code: code
        });
        
        this.saveCouponUsage();
    }

    // Obtener conteo de uso de cupón
    getCouponUsageCount(code, userId) {
        const key = `${userId}_${code}`;
        return this.couponUsage[key] ? this.couponUsage[key].length : 0;
    }

    // Obtener historial de cupones usados
    getCouponHistory(userId) {
        const history = [];
        
        for (const [key, uses] of Object.entries(this.couponUsage)) {
            if (key.startsWith(userId + '_')) {
                history.push(...uses);
            }
        }
        
        return history.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Helpers
    getUserPoints(userId) {
        return this.userPoints[userId] || 0;
    }

    isNewUser(userId) {
        // Verificar si el usuario es nuevo (menos de 30 días registrado)
        const registrationDate = localStorage.getItem(`user_registration_${userId}`);
        if (!registrationDate) return true;
        
        const regDate = new Date(registrationDate);
        const today = new Date();
        const daysDiff = (today - regDate) / (1000 * 60 * 60 * 24);
        
        return daysDiff <= 30;
    }

    isBirthdayMonth(userId) {
        // Verificar si estamos en el mes de cumpleaños del usuario
        const birthdayMonth = localStorage.getItem(`user_birthday_month_${userId}`);
        if (!birthdayMonth) return false;
        
        const currentMonth = new Date().getMonth() + 1;
        return parseInt(birthdayMonth) === currentMonth;
    }

    // Persistencia de datos
    loadUserCoupons() {
        const stored = localStorage.getItem('verano_user_coupons');
        return stored ? JSON.parse(stored) : {};
    }

    saveUserCoupons() {
        localStorage.setItem('verano_user_coupons', JSON.stringify(this.userCoupons));
    }

    loadUserPoints() {
        const stored = localStorage.getItem('verano_user_points');
        return stored ? JSON.parse(stored) : {};
    }

    saveUserPoints() {
        localStorage.setItem('verano_user_points', JSON.stringify(this.userPoints));
    }

    loadCouponUsage() {
        const stored = localStorage.getItem('verano_coupon_usage');
        return stored ? JSON.parse(stored) : {};
    }

    saveCouponUsage() {
        localStorage.setItem('verano_coupon_usage', JSON.stringify(this.couponUsage));
    }
}

// Instancia global del sistema de cupones
window.CouponSystemInstance = new CouponSystem();
