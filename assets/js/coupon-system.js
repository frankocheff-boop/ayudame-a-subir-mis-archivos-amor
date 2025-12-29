/**
 * Coupon System for VERANO ESTATE
 * Manages discount coupons, validation, and application
 */

class CouponSystem {
  static coupons = {
    FRANKO15: {
      type: 'percentage',
      value: 15,
      minPurchase: 500,
      maxUses: 1,
      validUntil: null,
      newUsersOnly: true,
      description: '15% descuento en tu primera orden'
    },
    BIRTHDAYCHEF: {
      type: 'combo',
      discount: 20,
      freeItem: 'postre-signature',
      validMonth: 'userBirthMonth',
      maxUses: 1,
      description: 'Postre gratis + 20% OFF en tu cumpleaños'
    },
    VERANO2025: {
      type: 'category',
      category: 'bebidas',
      value: 25,
      validUntil: '2025-09-21',
      maxUses: Infinity,
      description: '25% descuento en todas las bebidas'
    },
    REFERIDO20: {
      type: 'percentage',
      value: 20,
      minPurchase: 300,
      maxUses: 1,
      referralBonus: 200,
      description: '20% OFF para ti, $200 para quien te refirió'
    },
    CHEF50: {
      type: 'fixed',
      value: 50,
      minPurchase: 500,
      maxUses: Infinity,
      validUntil: '2025-12-31',
      description: '$50 de descuento en compras mayores a $500'
    }
  };

  static validateCoupon(code, userId, cartTotal, userBirthMonth) {
    const coupon = this.coupons[code.toUpperCase()];
    if (!coupon) {
      return { valid: false, message: 'Cupón inválido ❌' };
    }

    // Verificar mínimo de compra
    if (coupon.minPurchase && cartTotal < coupon.minPurchase) {
      return { 
        valid: false, 
        message: `Compra mínima: $${coupon.minPurchase} MXN` 
      };
    }

    // Verificar si es mes de cumpleaños
    if (coupon.validMonth === 'userBirthMonth') {
      const currentMonth = new Date().getMonth() + 1;
      if (currentMonth !== userBirthMonth) {
        return {
          valid: false,
          message: 'Este cupón solo es válido en tu mes de cumpleaños 🎂'
        };
      }
    }

    // Verificar usos del usuario
    const userUses = this.getUserCouponUses(userId, code);
    if (userUses >= coupon.maxUses) {
      return { 
        valid: false, 
        message: 'Ya usaste este cupón anteriormente' 
      };
    }

    // Verificar fecha de expiración
    if (coupon.validUntil) {
      const expiry = new Date(coupon.validUntil);
      if (Date.now() > expiry) {
        return { 
          valid: false, 
          message: 'Este cupón ya expiró 😔' 
        };
      }
    }

    // Verificar solo nuevos usuarios
    if (coupon.newUsersOnly && !this.isNewUser(userId)) {
      return {
        valid: false,
        message: 'Este cupón es solo para nuevos usuarios'
      };
    }

    return { valid: true, coupon };
  }

  static applyDiscount(coupon, cartTotal, cart) {
    let discount = 0;
    let freeItems = [];

    switch (coupon.type) {
      case 'percentage':
        discount = cartTotal * (coupon.value / 100);
        break;
      
      case 'fixed':
        discount = Math.min(coupon.value, cartTotal);
        break;
      
      case 'combo':
        discount = cartTotal * (coupon.discount / 100);
        freeItems.push(coupon.freeItem);
        break;
      
      case 'category':
        const categoryItems = cart.filter(i => i.category === coupon.category);
        const categoryTotal = categoryItems.reduce((sum, i) => sum + i.price * i.qty, 0);
        discount = categoryTotal * (coupon.value / 100);
        break;
    }

    return {
      discount: discount,
      newTotal: cartTotal - discount,
      freeItems: freeItems,
      message: `¡Ahorraste $${discount.toFixed(2)} MXN! 🎉`
    };
  }

  static getUserCouponUses(userId, code) {
    const key = `coupon_${userId}_${code}`;
    return parseInt(localStorage.getItem(key) || '0');
  }

  static recordCouponUse(userId, code) {
    const key = `coupon_${userId}_${code}`;
    const currentUses = this.getUserCouponUses(userId, code);
    localStorage.setItem(key, (currentUses + 1).toString());
  }

  static isNewUser(userId) {
    const orderCount = parseInt(localStorage.getItem(`orders_${userId}`) || '0');
    return orderCount === 0;
  }

  static getAvailableCoupons(userId, userBirthMonth) {
    const available = [];
    const currentMonth = new Date().getMonth() + 1;

    for (const [code, coupon] of Object.entries(this.coupons)) {
      const uses = this.getUserCouponUses(userId, code);
      
      // Verificar si aún tiene usos disponibles
      if (uses >= coupon.maxUses && coupon.maxUses !== Infinity) continue;
      
      // Verificar si expiró
      if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) continue;
      
      // Verificar mes de cumpleaños
      if (coupon.validMonth === 'userBirthMonth' && currentMonth !== userBirthMonth) continue;
      
      // Verificar solo nuevos usuarios
      if (coupon.newUsersOnly && !this.isNewUser(userId)) continue;

      available.push({ code, ...coupon });
    }

    return available;
  }
}
