/**
 * VERANO ESTATE - Ticket Manager UI
 * Controlador del interfaz de usuario del gestor de tickets
 */

class TicketManagerUI {
  constructor() {
    this.ticketSystem = window.TicketSystemInstance;
    this.ticketPrinter = window.TicketPrinterInstance;
    this.currentTickets = [];
    this.currentTicketId = null;
    this.statsUpdateInterval = null;
  }

  /**
   * Inicializar el UI
   */
  async init() {
    console.log('🎫 Inicializando Ticket Manager...');
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Cargar estadísticas iniciales
    await this.actualizarStats();
    
    // Cargar tickets del día
    await this.cargarTicketsHoy();
    
    // Actualizar stats cada 30 segundos
    this.statsUpdateInterval = setInterval(() => {
      this.actualizarStats();
    }, 30000);
    
    console.log('✅ Ticket Manager inicializado');
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Búsqueda
    const searchBtn = document.getElementById('btn-buscar');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => this.buscar());
    }

    // Enter en inputs de búsqueda
    const searchInputs = document.querySelectorAll('#search-numero, #search-fecha-inicio, #search-fecha-fin');
    searchInputs.forEach(input => {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.buscar();
        }
      });
    });

    // Limpiar filtros
    const clearBtn = document.getElementById('btn-limpiar');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.limpiarFiltros());
    }

    // Exportar Excel
    const exportBtn = document.getElementById('btn-exportar');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportarExcel());
    }

    // Cerrar modal
    const closeModal = document.querySelector('.close');
    if (closeModal) {
      closeModal.addEventListener('click', () => this.cerrarModal());
    }

    // Cerrar modal al hacer click fuera
    const modal = document.getElementById('modal-detalles');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.cerrarModal();
        }
      });
    }
  }

  /**
   * Cargar tickets de hoy
   */
  async cargarTicketsHoy() {
    try {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      const tickets = await this.ticketSystem.buscarTickets({
        fechaInicio: hoy.toISOString().split('T')[0],
        limite: 100
      });
      
      this.currentTickets = tickets;
      this.renderTabla(tickets);
    } catch (error) {
      console.error('❌ Error al cargar tickets de hoy:', error);
      this.mostrarError('No se pudieron cargar los tickets de hoy');
    }
  }

  /**
   * Buscar tickets con filtros
   */
  async buscar() {
    try {
      const numero = document.getElementById('search-numero')?.value.trim();
      const fechaInicio = document.getElementById('search-fecha-inicio')?.value;
      const fechaFin = document.getElementById('search-fecha-fin')?.value;
      const metodo = document.getElementById('search-metodo')?.value;

      const filtros = {};
      
      if (numero) {
        filtros.numero = numero;
      }
      
      if (fechaInicio) {
        filtros.fechaInicio = fechaInicio;
      }
      
      if (fechaFin) {
        filtros.fechaFin = fechaFin;
      }
      
      if (metodo) {
        filtros.metodo = metodo;
      }

      // Si no hay filtros, cargar tickets de hoy
      if (Object.keys(filtros).length === 0) {
        await this.cargarTicketsHoy();
        return;
      }

      const tickets = await this.ticketSystem.buscarTickets(filtros);
      this.currentTickets = tickets;
      this.renderTabla(tickets);

      // Mostrar mensaje si no hay resultados
      if (tickets.length === 0) {
        this.mostrarMensaje('No se encontraron tickets con los filtros especificados', 'warning');
      }
    } catch (error) {
      console.error('❌ Error al buscar tickets:', error);
      this.mostrarError('Error al buscar tickets: ' + error.message);
    }
  }

  /**
   * Limpiar filtros de búsqueda
   */
  async limpiarFiltros() {
    const numeroInput = document.getElementById('search-numero');
    const fechaInicioInput = document.getElementById('search-fecha-inicio');
    const fechaFinInput = document.getElementById('search-fecha-fin');
    const metodoSelect = document.getElementById('search-metodo');
    
    if (numeroInput) numeroInput.value = '';
    if (fechaInicioInput) fechaInicioInput.value = '';
    if (fechaFinInput) fechaFinInput.value = '';
    if (metodoSelect) metodoSelect.value = '';
    
    await this.cargarTicketsHoy();
  }

  /**
   * Actualizar estadísticas
   */
  async actualizarStats() {
    try {
      const stats = await this.ticketSystem.estadisticasHoy();
      
      // Animar números
      this.animarNumero('total-tickets', stats.totalTickets);
      this.animarDinero('venta-total', stats.ventaTotal);
      this.animarDinero('ticket-promedio', stats.ticketPromedio);
      this.animarDinero('propinas', stats.propinasTotal);
      
      // Actualizar stats adicionales si existen
      if (document.getElementById('descuentos')) {
        this.animarDinero('descuentos', stats.descuentosTotal);
      }
      
      if (document.getElementById('efectivo-total')) {
        this.animarDinero('efectivo-total', stats.porMetodo.efectivo.monto);
      }
      
      if (document.getElementById('tarjeta-total')) {
        this.animarDinero('tarjeta-total', stats.porMetodo.tarjeta.monto);
      }
      
      if (document.getElementById('transferencia-total')) {
        this.animarDinero('transferencia-total', stats.porMetodo.transferencia.monto);
      }
    } catch (error) {
      console.error('❌ Error al actualizar estadísticas:', error);
    }
  }

  /**
   * Animar cambio de número
   */
  animarNumero(elementId, valor) {
    const elemento = document.getElementById(elementId);
    if (!elemento) return;
    
    const valorActual = parseInt(elemento.textContent) || 0;
    const diferencia = valor - valorActual;
    const pasos = 20;
    const incremento = diferencia / pasos;
    let paso = 0;
    
    const intervalo = setInterval(() => {
      paso++;
      const nuevoValor = Math.round(valorActual + (incremento * paso));
      elemento.textContent = nuevoValor;
      
      if (paso >= pasos) {
        clearInterval(intervalo);
        elemento.textContent = valor;
      }
    }, 20);
  }

  /**
   * Animar cambio de dinero
   */
  animarDinero(elementId, valor) {
    const elemento = document.getElementById(elementId);
    if (!elemento) return;
    
    const textoActual = elemento.textContent.replace(/[^0-9.]/g, '');
    const valorActual = parseFloat(textoActual) || 0;
    const diferencia = valor - valorActual;
    const pasos = 20;
    const incremento = diferencia / pasos;
    let paso = 0;
    
    const intervalo = setInterval(() => {
      paso++;
      const nuevoValor = valorActual + (incremento * paso);
      elemento.textContent = '$' + nuevoValor.toFixed(2);
      
      if (paso >= pasos) {
        clearInterval(intervalo);
        elemento.textContent = '$' + valor.toFixed(2);
      }
    }, 20);
  }

  /**
   * Renderizar tabla de tickets
   */
  renderTabla(tickets) {
    const tbody = document.getElementById('tickets-tbody');
    if (!tbody) return;

    if (tickets.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; color: #6B6B6B;">
            <span style="font-size: 3em; display: block; margin-bottom: 10px;">🎫</span>
            No hay tickets para mostrar
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = tickets.map(ticket => {
      const fecha = new Date(ticket.timestamp);
      const itemsCount = ticket.items ? ticket.items.length : 0;
      
      return `
        <tr class="ticket-row" data-ticket-id="${ticket.id}">
          <td class="ticket-numero">${ticket.numero}</td>
          <td>${fecha.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit' })} ${fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</td>
          <td>${ticket.cliente}</td>
          <td>${itemsCount} item${itemsCount !== 1 ? 's' : ''}</td>
          <td class="ticket-total">$${ticket.total.toFixed(2)}</td>
          <td><span class="badge badge-${ticket.metodo}">${this.capitalizar(ticket.metodo)}</span></td>
          <td class="ticket-actions">
            <button onclick="ticketManagerUI.mostrarDetalles('${ticket.id}')" class="btn-action btn-view" title="Ver detalles">
              👁️
            </button>
            <button onclick="ticketManagerUI.imprimirTicket('${ticket.id}')" class="btn-action btn-print" title="Imprimir">
              🖨️
            </button>
            <button onclick="ticketManagerUI.enviarWhatsApp('${ticket.id}')" class="btn-action btn-whatsapp" title="WhatsApp">
              📱
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  /**
   * Mostrar detalles de un ticket
   */
  async mostrarDetalles(ticketId) {
    try {
      const ticket = await this.ticketSystem.obtenerTicket(ticketId);
      if (!ticket) {
        this.mostrarError('No se encontró el ticket');
        return;
      }

      this.currentTicketId = ticketId;

      // Actualizar contenido del modal
      document.getElementById('modal-numero').textContent = ticket.numero;
      
      const modalBody = document.getElementById('modal-body');
      modalBody.innerHTML = `
        <div class="ticket-detalles">
          <div class="detail-section">
            <h3>📋 Información General</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">Fecha:</span>
                <span>${new Date(ticket.timestamp).toLocaleString('es-MX')}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Cliente:</span>
                <span>${ticket.cliente}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Mesero:</span>
                <span>${ticket.mesero}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Método:</span>
                <span class="badge badge-${ticket.metodo}">${this.capitalizar(ticket.metodo)}</span>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h3>🍽️ Items Ordenados</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th style="text-align: center;">Cant.</th>
                  <th style="text-align: right;">Precio</th>
                  <th style="text-align: right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${ticket.items.map(item => `
                  <tr>
                    <td>${item.nombre}</td>
                    <td style="text-align: center;">${item.cantidad}</td>
                    <td style="text-align: right;">$${item.precio.toFixed(2)}</td>
                    <td style="text-align: right;">$${item.subtotal.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="detail-section">
            <h3>💰 Totales</h3>
            <div class="totals-grid">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>$${ticket.subtotal.toFixed(2)}</span>
              </div>
              ${ticket.descuento > 0 ? `
              <div class="total-row discount">
                <span>Descuento:</span>
                <span>-$${ticket.descuento.toFixed(2)}</span>
              </div>
              ` : ''}
              <div class="total-row">
                <span>IVA (16%):</span>
                <span>$${ticket.iva.toFixed(2)}</span>
              </div>
              ${ticket.propina > 0 ? `
              <div class="total-row">
                <span>Propina:</span>
                <span>$${ticket.propina.toFixed(2)}</span>
              </div>
              ` : ''}
              <div class="total-row total">
                <span>TOTAL:</span>
                <span>$${ticket.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          ${ticket.notas ? `
          <div class="detail-section">
            <h3>📝 Notas</h3>
            <p class="notas-text">${ticket.notas}</p>
          </div>
          ` : ''}
        </div>
      `;

      // Mostrar modal
      const modal = document.getElementById('modal-detalles');
      modal.style.display = 'flex';
    } catch (error) {
      console.error('❌ Error al mostrar detalles:', error);
      this.mostrarError('Error al cargar detalles del ticket');
    }
  }

  /**
   * Cerrar modal
   */
  cerrarModal() {
    const modal = document.getElementById('modal-detalles');
    if (modal) {
      modal.style.display = 'none';
    }
    this.currentTicketId = null;
  }

  /**
   * Imprimir ticket
   */
  async imprimirTicket(ticketId = null) {
    try {
      const id = ticketId || this.currentTicketId;
      if (!id) {
        this.mostrarError('No se ha seleccionado ningún ticket');
        return;
      }

      await this.ticketPrinter.imprimir(id, 'thermal');
    } catch (error) {
      console.error('❌ Error al imprimir:', error);
      this.mostrarError('Error al imprimir el ticket');
    }
  }

  /**
   * Descargar PDF
   */
  async descargarPDF(ticketId = null) {
    try {
      const id = ticketId || this.currentTicketId;
      if (!id) {
        this.mostrarError('No se ha seleccionado ningún ticket');
        return;
      }

      await this.ticketPrinter.imprimir(id, 'pdf');
    } catch (error) {
      console.error('❌ Error al descargar PDF:', error);
      this.mostrarError('Error al generar PDF');
    }
  }

  /**
   * Enviar por WhatsApp
   */
  async enviarWhatsApp(ticketId = null) {
    try {
      const id = ticketId || this.currentTicketId;
      if (!id) {
        this.mostrarError('No se ha seleccionado ningún ticket');
        return;
      }

      const ticket = await this.ticketSystem.obtenerTicket(id);
      if (!ticket) {
        this.mostrarError('No se encontró el ticket');
        return;
      }

      this.ticketPrinter.enviarPorWhatsApp(ticket);
    } catch (error) {
      console.error('❌ Error al enviar por WhatsApp:', error);
      this.mostrarError('Error al abrir WhatsApp');
    }
  }

  /**
   * Exportar a Excel (CSV)
   */
  async exportarExcel() {
    try {
      if (this.currentTickets.length === 0) {
        this.mostrarMensaje('No hay tickets para exportar', 'warning');
        return;
      }

      this.ticketPrinter.descargarCSV(this.currentTickets, 'tickets_verano_estate');
      this.mostrarMensaje('✅ Tickets exportados correctamente', 'success');
    } catch (error) {
      console.error('❌ Error al exportar:', error);
      this.mostrarError('Error al exportar tickets');
    }
  }

  /**
   * Mostrar mensaje de error
   */
  mostrarError(mensaje) {
    alert('❌ ' + mensaje);
  }

  /**
   * Mostrar mensaje general
   */
  mostrarMensaje(mensaje, tipo = 'info') {
    const iconos = {
      success: '✅',
      warning: '⚠️',
      info: 'ℹ️',
      error: '❌'
    };
    
    alert((iconos[tipo] || '') + ' ' + mensaje);
  }

  /**
   * Capitalizar texto
   */
  capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Limpiar al destruir
   */
  destroy() {
    if (this.statsUpdateInterval) {
      clearInterval(this.statsUpdateInterval);
    }
  }
}

// Inicializar cuando el DOM esté listo
let ticketManagerUI = null;

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    ticketManagerUI = new TicketManagerUI();
    ticketManagerUI.init();
  });
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.TicketManagerUI = TicketManagerUI;
  window.ticketManagerUI = ticketManagerUI;
}
