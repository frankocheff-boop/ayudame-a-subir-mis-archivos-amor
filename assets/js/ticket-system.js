/**
 * VERANO ESTATE - Sistema de Tickets
 * Sistema completo de gestión de tickets con Firebase Firestore
 */

class TicketSystem {
  constructor() {
    this.db = null;
    this.ticketsCollection = 'tickets';
    this.dailyCounter = this.loadDailyCounter();
    this.initializeFirestore();
  }

  /**
   * Inicializar Firestore
   */
  initializeFirestore() {
    if (typeof getFirestore === 'function') {
      this.db = getFirestore();
      if (!this.db) {
        console.warn('⚠️ Firestore no disponible. Sistema de tickets funcionará en modo offline.');
      }
    } else {
      console.warn('⚠️ Firebase no configurado. Sistema de tickets funcionará en modo offline.');
    }
  }

  /**
   * Cargar contador diario desde localStorage
   */
  loadDailyCounter() {
    try {
      const stored = localStorage.getItem('ve_daily_counter');
      if (stored) {
        const data = JSON.parse(stored);
        const today = new Date().toISOString().split('T')[0];
        if (data.date === today) {
          return data.counter;
        }
      }
    } catch (e) {
      console.error('Error loading daily counter:', e);
    }
    return 0;
  }

  /**
   * Guardar contador diario en localStorage
   */
  saveDailyCounter(counter) {
    try {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem('ve_daily_counter', JSON.stringify({
        date: today,
        counter: counter
      }));
    } catch (e) {
      console.error('Error saving daily counter:', e);
    }
  }

  /**
   * Generar número único de ticket
   * Formato: VE-YYYYMMDD-XXXX
   */
  generarNumeroTicket() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    this.dailyCounter++;
    this.saveDailyCounter(this.dailyCounter);
    
    const counter = String(this.dailyCounter).padStart(4, '0');
    return `VE-${year}${month}${day}-${counter}`;
  }

  /**
   * Crear un nuevo ticket
   * @param {Object} ordenData - Datos de la orden
   * @returns {Promise<Object>} Ticket creado con ID
   */
  async crearTicket(ordenData) {
    try {
      // Generar número de ticket
      const numeroTicket = this.generarNumeroTicket();
      
      // Crear objeto de ticket
      const ticket = {
        numero: numeroTicket,
        timestamp: new Date(),
        cliente: ordenData.cliente || 'Mostrador',
        mesero: ordenData.mesero || 'Sistema',
        items: ordenData.items || [],
        subtotal: ordenData.subtotal || 0,
        descuento: ordenData.descuento || 0,
        cupon: ordenData.cupon || null,
        iva: ordenData.iva || 0,
        propina: ordenData.propina || 0,
        total: ordenData.total || 0,
        metodo: ordenData.metodo || 'efectivo',
        notas: ordenData.notas || ''
      };

      // Si Firestore está disponible, guardar en la nube
      if (this.db) {
        const docRef = await this.db.collection(this.ticketsCollection).add({
          ...ticket,
          timestamp: typeof getServerTimestamp === 'function' ? getServerTimestamp() : 
                     (typeof firebase !== 'undefined' && firebase.firestore ? firebase.firestore.FieldValue.serverTimestamp() : new Date())
        });
        
        console.log('✅ Ticket guardado en Firebase:', numeroTicket);
        
        return {
          id: docRef.id,
          ticket: ticket
        };
      } else {
        // Modo offline: guardar en localStorage
        const localTickets = this.getLocalTickets();
        const ticketId = `local_${Date.now()}`;
        localTickets[ticketId] = ticket;
        localStorage.setItem('ve_local_tickets', JSON.stringify(localTickets));
        
        console.log('⚠️ Ticket guardado localmente (offline):', numeroTicket);
        
        return {
          id: ticketId,
          ticket: ticket
        };
      }
    } catch (error) {
      console.error('❌ Error al crear ticket:', error);
      throw new Error('No se pudo crear el ticket: ' + error.message);
    }
  }

  /**
   * Obtener tickets locales (modo offline)
   */
  getLocalTickets() {
    try {
      const stored = localStorage.getItem('ve_local_tickets');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error('Error loading local tickets:', e);
      return {};
    }
  }

  /**
   * Buscar tickets con filtros
   * @param {Object} filtros - Filtros de búsqueda
   * @returns {Promise<Array>} Array de tickets
   */
  async buscarTickets(filtros = {}) {
    try {
      if (this.db) {
        // Buscar en Firebase
        let query = this.db.collection(this.ticketsCollection);
        
        // Aplicar filtros
        if (filtros.numero) {
          query = query.where('numero', '==', filtros.numero);
        }
        
        if (filtros.fechaInicio) {
          const fechaInicio = new Date(filtros.fechaInicio);
          fechaInicio.setHours(0, 0, 0, 0);
          query = query.where('timestamp', '>=', fechaInicio);
        }
        
        if (filtros.fechaFin) {
          const fechaFin = new Date(filtros.fechaFin);
          fechaFin.setHours(23, 59, 59, 999);
          query = query.where('timestamp', '<=', fechaFin);
        }
        
        if (filtros.metodo) {
          query = query.where('metodo', '==', filtros.metodo);
        }
        
        // Ordenar por fecha descendente
        query = query.orderBy('timestamp', 'desc');
        
        // Límite de resultados
        if (filtros.limite) {
          query = query.limit(filtros.limite);
        }
        
        const snapshot = await query.get();
        const tickets = [];
        
        snapshot.forEach(doc => {
          tickets.push({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date()
          });
        });
        
        return tickets;
      } else {
        // Buscar en localStorage
        const localTickets = this.getLocalTickets();
        let tickets = Object.keys(localTickets).map(id => ({
          id: id,
          ...localTickets[id],
          timestamp: new Date(localTickets[id].timestamp)
        }));
        
        // Aplicar filtros
        if (filtros.numero) {
          tickets = tickets.filter(t => t.numero === filtros.numero);
        }
        
        if (filtros.fechaInicio) {
          const fechaInicio = new Date(filtros.fechaInicio);
          fechaInicio.setHours(0, 0, 0, 0);
          tickets = tickets.filter(t => new Date(t.timestamp) >= fechaInicio);
        }
        
        if (filtros.fechaFin) {
          const fechaFin = new Date(filtros.fechaFin);
          fechaFin.setHours(23, 59, 59, 999);
          tickets = tickets.filter(t => new Date(t.timestamp) <= fechaFin);
        }
        
        if (filtros.metodo) {
          tickets = tickets.filter(t => t.metodo === filtros.metodo);
        }
        
        // Ordenar por fecha descendente
        tickets.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Límite de resultados
        if (filtros.limite) {
          tickets = tickets.slice(0, filtros.limite);
        }
        
        return tickets;
      }
    } catch (error) {
      console.error('❌ Error al buscar tickets:', error);
      throw new Error('No se pudo buscar tickets: ' + error.message);
    }
  }

  /**
   * Obtener un ticket por ID
   * @param {string} ticketId - ID del ticket
   * @returns {Promise<Object|null>} Ticket o null si no existe
   */
  async obtenerTicket(ticketId) {
    try {
      if (this.db && !ticketId.startsWith('local_')) {
        const doc = await this.db.collection(this.ticketsCollection).doc(ticketId).get();
        if (doc.exists) {
          return {
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date()
          };
        }
      } else {
        // Buscar en localStorage
        const localTickets = this.getLocalTickets();
        if (localTickets[ticketId]) {
          return {
            id: ticketId,
            ...localTickets[ticketId],
            timestamp: new Date(localTickets[ticketId].timestamp)
          };
        }
      }
      return null;
    } catch (error) {
      console.error('❌ Error al obtener ticket:', error);
      return null;
    }
  }

  /**
   * Obtener estadísticas de un periodo
   * @param {Object} periodo - {fechaInicio, fechaFin}
   * @returns {Promise<Object>} Estadísticas calculadas
   */
  async obtenerEstadisticas(periodo = {}) {
    try {
      // Si no se especifica periodo, usar hoy
      if (!periodo.fechaInicio) {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        periodo.fechaInicio = hoy;
      }
      
      if (!periodo.fechaFin) {
        const hoy = new Date();
        hoy.setHours(23, 59, 59, 999);
        periodo.fechaFin = hoy;
      }
      
      // Buscar tickets del periodo
      const tickets = await this.buscarTickets({
        fechaInicio: periodo.fechaInicio,
        fechaFin: periodo.fechaFin
      });
      
      // Calcular estadísticas
      const stats = {
        totalTickets: tickets.length,
        ventaTotal: 0,
        ticketPromedio: 0,
        propinasTotal: 0,
        descuentosTotal: 0,
        ivaTotal: 0,
        porMetodo: {
          efectivo: { cantidad: 0, monto: 0 },
          tarjeta: { cantidad: 0, monto: 0 },
          transferencia: { cantidad: 0, monto: 0 }
        },
        productosVendidos: {},
        distribucionHoraria: Array(24).fill(0)
      };
      
      tickets.forEach(ticket => {
        stats.ventaTotal += ticket.total || 0;
        stats.propinasTotal += ticket.propina || 0;
        stats.descuentosTotal += ticket.descuento || 0;
        stats.ivaTotal += ticket.iva || 0;
        
        // Por método de pago
        const metodo = ticket.metodo || 'efectivo';
        if (stats.porMetodo[metodo]) {
          stats.porMetodo[metodo].cantidad++;
          stats.porMetodo[metodo].monto += ticket.total || 0;
        }
        
        // Productos vendidos
        if (ticket.items && Array.isArray(ticket.items)) {
          ticket.items.forEach(item => {
            const nombre = item.nombre;
            if (!stats.productosVendidos[nombre]) {
              stats.productosVendidos[nombre] = {
                cantidad: 0,
                total: 0
              };
            }
            stats.productosVendidos[nombre].cantidad += item.cantidad || 0;
            stats.productosVendidos[nombre].total += item.subtotal || 0;
          });
        }
        
        // Distribución horaria
        const hora = new Date(ticket.timestamp).getHours();
        stats.distribucionHoraria[hora]++;
      });
      
      // Calcular promedio
      if (stats.totalTickets > 0) {
        stats.ticketPromedio = stats.ventaTotal / stats.totalTickets;
      }
      
      // Top 5 productos
      stats.topProductos = Object.keys(stats.productosVendidos)
        .map(nombre => ({
          nombre: nombre,
          cantidad: stats.productosVendidos[nombre].cantidad,
          total: stats.productosVendidos[nombre].total
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);
      
      return stats;
    } catch (error) {
      console.error('❌ Error al obtener estadísticas:', error);
      throw new Error('No se pudo obtener estadísticas: ' + error.message);
    }
  }

  /**
   * Obtener estadísticas de hoy
   * @returns {Promise<Object>} Estadísticas del día
   */
  async estadisticasHoy() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const hoyFin = new Date();
    hoyFin.setHours(23, 59, 59, 999);
    
    return await this.obtenerEstadisticas({
      fechaInicio: hoy,
      fechaFin: hoyFin
    });
  }

  /**
   * Formatear ticket para diferentes usos
   * @param {Object} ticket - Ticket a formatear
   * @param {string} formato - 'thermal' | 'pdf' | 'whatsapp' | 'email'
   * @returns {string} Ticket formateado
   */
  formatearTicket(ticket, formato = 'thermal') {
    switch (formato) {
      case 'thermal':
        return this.formatearThermal(ticket);
      case 'whatsapp':
        return this.formatearWhatsApp(ticket);
      default:
        return this.formatearThermal(ticket);
    }
  }

  /**
   * Formatear ticket para impresora térmica (58mm / 32 caracteres)
   */
  formatearThermal(ticket) {
    const w = 32; // Ancho de impresora
    const line = '='.repeat(w);
    const dash = '-'.repeat(w);
    
    let texto = '';
    texto += line + '\n';
    texto += this.center('VERANO ESTATE', w) + '\n';
    texto += this.center('GOURMET', w) + '\n';
    texto += line + '\n';
    texto += `Ticket: ${ticket.numero}\n`;
    texto += `Fecha: ${this.formatearFecha(ticket.timestamp)}\n`;
    texto += `Cliente: ${ticket.cliente}\n`;
    texto += `Mesero: ${ticket.mesero}\n`;
    texto += dash + '\n';
    
    // Items
    ticket.items.forEach(item => {
      const nombre = this.truncate(item.nombre, 20);
      const qty = `${item.cantidad}x`;
      const precio = this.formatMoney(item.precio);
      const subtotal = this.formatMoney(item.subtotal);
      
      texto += `${nombre}\n`;
      texto += this.justify(`  ${qty} @ ${precio}`, subtotal, w) + '\n';
    });
    
    texto += dash + '\n';
    texto += this.justify('Subtotal:', this.formatMoney(ticket.subtotal), w) + '\n';
    
    if (ticket.descuento > 0) {
      texto += this.justify('Descuento:', '-' + this.formatMoney(ticket.descuento), w) + '\n';
    }
    
    texto += this.justify('IVA (16%):', this.formatMoney(ticket.iva), w) + '\n';
    
    if (ticket.propina > 0) {
      texto += this.justify('Propina:', this.formatMoney(ticket.propina), w) + '\n';
    }
    
    texto += line + '\n';
    texto += this.justify('TOTAL:', this.formatMoney(ticket.total), w) + '\n';
    texto += line + '\n';
    texto += `Metodo: ${ticket.metodo.toUpperCase()}\n`;
    
    if (ticket.notas) {
      texto += dash + '\n';
      texto += `Notas: ${ticket.notas}\n`;
    }
    
    texto += dash + '\n';
    texto += this.center('¡Gracias por su visita!', w) + '\n';
    texto += this.center('www.veranoestate.com', w) + '\n';
    texto += line + '\n';
    
    return texto;
  }

  /**
   * Formatear ticket para WhatsApp
   */
  formatearWhatsApp(ticket) {
    let texto = '';
    texto += '🏖️ *VERANO ESTATE*\n';
    texto += '━━━━━━━━━━━━━━━━━━━\n\n';
    texto += `🎫 Ticket: *${ticket.numero}*\n`;
    texto += `📅 ${this.formatearFecha(ticket.timestamp)}\n`;
    texto += `👤 Cliente: ${ticket.cliente}\n\n`;
    
    texto += '*📋 Orden:*\n';
    ticket.items.forEach(item => {
      texto += `• ${item.cantidad}x ${item.nombre}\n`;
      texto += `  ${this.formatMoney(item.subtotal)}\n`;
    });
    
    texto += '\n━━━━━━━━━━━━━━━━━━━\n';
    texto += `💵 Subtotal: ${this.formatMoney(ticket.subtotal)}\n`;
    
    if (ticket.descuento > 0) {
      texto += `🎁 Descuento: -${this.formatMoney(ticket.descuento)}\n`;
    }
    
    texto += `📊 IVA: ${this.formatMoney(ticket.iva)}\n`;
    
    if (ticket.propina > 0) {
      texto += `🙏 Propina: ${this.formatMoney(ticket.propina)}\n`;
    }
    
    texto += `\n💰 *TOTAL: ${this.formatMoney(ticket.total)}*\n`;
    texto += `💳 Método: ${ticket.metodo}\n\n`;
    texto += '✨ ¡Gracias por su preferencia!\n';
    
    return texto;
  }

  // Utilidades de formateo
  center(text, width) {
    const padding = Math.max(0, Math.floor((width - text.length) / 2));
    return ' '.repeat(padding) + text;
  }

  justify(left, right, width) {
    const spaces = Math.max(1, width - left.length - right.length);
    return left + ' '.repeat(spaces) + right;
  }

  truncate(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
  }

  formatMoney(amount) {
    return '$' + (amount || 0).toFixed(2);
  }

  formatearFecha(date) {
    const d = new Date(date);
    return d.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

// Crear instancia global
if (typeof window !== 'undefined') {
  window.TicketSystem = TicketSystem;
  window.TicketSystemInstance = new TicketSystem();
}
