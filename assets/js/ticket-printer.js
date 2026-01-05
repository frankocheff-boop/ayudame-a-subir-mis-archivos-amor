/**
 * VERANO ESTATE - Ticket Printer Utilities
 * Utilidades para imprimir y exportar tickets en diferentes formatos
 */

class TicketPrinter {
  constructor() {
    this.ticketSystem = window.TicketSystemInstance;
  }

  /**
   * Generar HTML para impresión térmica (58mm)
   * @param {Object} ticket - Ticket a imprimir
   * @returns {string} HTML formateado
   */
  generarFormatoThermal(ticket) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Ticket ${ticket.numero}</title>
        <style>
          @page {
            size: 58mm auto;
            margin: 0;
          }
          
          @media print {
            body {
              width: 58mm;
              margin: 0;
              padding: 2mm;
            }
          }
          
          body {
            font-family: 'Courier New', monospace;
            font-size: 10pt;
            line-height: 1.3;
            margin: 0;
            padding: 5mm;
            background: white;
          }
          
          .center {
            text-align: center;
          }
          
          .bold {
            font-weight: bold;
          }
          
          .line {
            border-top: 1px dashed #000;
            margin: 3mm 0;
          }
          
          .header {
            text-align: center;
            font-weight: bold;
            font-size: 12pt;
            margin-bottom: 3mm;
          }
          
          .item {
            margin: 2mm 0;
          }
          
          .item-row {
            display: flex;
            justify-content: space-between;
          }
          
          .total-section {
            border-top: 2px solid #000;
            border-bottom: 2px solid #000;
            padding: 2mm 0;
            margin: 3mm 0;
            font-weight: bold;
          }
          
          .footer {
            text-align: center;
            margin-top: 5mm;
            font-size: 9pt;
          }
        </style>
      </head>
      <body>
        <div class="header">
          VERANO ESTATE<br>
          GOURMET
        </div>
        
        <div class="line"></div>
        
        <div>
          <strong>Ticket:</strong> ${ticket.numero}<br>
          <strong>Fecha:</strong> ${this.formatearFecha(ticket.timestamp)}<br>
          <strong>Cliente:</strong> ${ticket.cliente}<br>
          <strong>Mesero:</strong> ${ticket.mesero}
        </div>
        
        <div class="line"></div>
        
        <div class="items">
          ${ticket.items.map(item => `
            <div class="item">
              <div>${item.nombre}</div>
              <div class="item-row">
                <span>${item.cantidad}x @ ${this.formatMoney(item.precio)}</span>
                <span>${this.formatMoney(item.subtotal)}</span>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="line"></div>
        
        <div class="item-row">
          <span>Subtotal:</span>
          <span>${this.formatMoney(ticket.subtotal)}</span>
        </div>
        
        ${ticket.descuento > 0 ? `
        <div class="item-row">
          <span>Descuento:</span>
          <span>-${this.formatMoney(ticket.descuento)}</span>
        </div>
        ` : ''}
        
        <div class="item-row">
          <span>IVA (16%):</span>
          <span>${this.formatMoney(ticket.iva)}</span>
        </div>
        
        ${ticket.propina > 0 ? `
        <div class="item-row">
          <span>Propina:</span>
          <span>${this.formatMoney(ticket.propina)}</span>
        </div>
        ` : ''}
        
        <div class="total-section">
          <div class="item-row">
            <span>TOTAL:</span>
            <span>${this.formatMoney(ticket.total)}</span>
          </div>
        </div>
        
        <div class="item-row">
          <span>Método de Pago:</span>
          <span>${this.capitalizar(ticket.metodo)}</span>
        </div>
        
        ${ticket.notas ? `
        <div class="line"></div>
        <div>
          <strong>Notas:</strong><br>
          ${ticket.notas}
        </div>
        ` : ''}
        
        <div class="line"></div>
        
        <div class="footer">
          ¡Gracias por su visita!<br>
          www.veranoestate.com
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generar HTML para PDF elegante
   * @param {Object} ticket - Ticket a convertir
   * @returns {string} HTML formateado
   */
  generarFormatoPDF(ticket) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Ticket ${ticket.numero}</title>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }
          
          body {
            font-family: 'Lato', sans-serif;
            color: #2C2C2C;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          
          .header {
            text-align: center;
            border-bottom: 3px solid #DC143C;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          
          .header h1 {
            font-family: 'Playfair Display', serif;
            font-size: 2.5em;
            color: #DC143C;
            margin: 0;
          }
          
          .header .subtitle {
            font-size: 1.2em;
            color: #D4AF37;
            margin: 5px 0;
          }
          
          .ticket-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 30px 0;
            padding: 20px;
            background: #FAF7F2;
            border-radius: 8px;
          }
          
          .ticket-info .label {
            font-weight: 600;
            color: #DC143C;
          }
          
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
          }
          
          .items-table th {
            background: #DC143C;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
          }
          
          .items-table td {
            padding: 10px 12px;
            border-bottom: 1px solid #E0E0E0;
          }
          
          .items-table tr:hover {
            background: #FFF8F0;
          }
          
          .totals {
            margin-top: 30px;
            padding: 20px;
            background: #FAF7F2;
            border-radius: 8px;
          }
          
          .totals .row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 1.1em;
          }
          
          .totals .total-row {
            border-top: 2px solid #DC143C;
            margin-top: 10px;
            padding-top: 15px;
            font-weight: bold;
            font-size: 1.3em;
            color: #DC143C;
          }
          
          .footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #E0E0E0;
            color: #6B6B6B;
          }
          
          .footer .thanks {
            font-size: 1.2em;
            font-weight: 600;
            color: #DC143C;
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>VERANO ESTATE</h1>
          <div class="subtitle">GOURMET EXPERIENCE</div>
        </div>
        
        <div class="ticket-info">
          <div>
            <div class="label">Ticket</div>
            <div>${ticket.numero}</div>
          </div>
          <div>
            <div class="label">Fecha</div>
            <div>${this.formatearFecha(ticket.timestamp)}</div>
          </div>
          <div>
            <div class="label">Cliente</div>
            <div>${ticket.cliente}</div>
          </div>
          <div>
            <div class="label">Mesero</div>
            <div>${ticket.mesero}</div>
          </div>
        </div>
        
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
                <td style="text-align: right;">${this.formatMoney(item.precio)}</td>
                <td style="text-align: right;">${this.formatMoney(item.subtotal)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="totals">
          <div class="row">
            <span>Subtotal:</span>
            <span>${this.formatMoney(ticket.subtotal)}</span>
          </div>
          
          ${ticket.descuento > 0 ? `
          <div class="row">
            <span>Descuento:</span>
            <span>-${this.formatMoney(ticket.descuento)}</span>
          </div>
          ` : ''}
          
          <div class="row">
            <span>IVA (16%):</span>
            <span>${this.formatMoney(ticket.iva)}</span>
          </div>
          
          ${ticket.propina > 0 ? `
          <div class="row">
            <span>Propina:</span>
            <span>${this.formatMoney(ticket.propina)}</span>
          </div>
          ` : ''}
          
          <div class="row total-row">
            <span>TOTAL:</span>
            <span>${this.formatMoney(ticket.total)}</span>
          </div>
          
          <div class="row" style="margin-top: 15px; font-weight: 600;">
            <span>Método de Pago:</span>
            <span>${this.capitalizar(ticket.metodo)}</span>
          </div>
        </div>
        
        ${ticket.notas ? `
        <div style="margin-top: 30px; padding: 15px; background: #FFF8F0; border-left: 4px solid #D4AF37; border-radius: 4px;">
          <strong style="color: #DC143C;">Notas:</strong><br>
          ${ticket.notas}
        </div>
        ` : ''}
        
        <div class="footer">
          <div class="thanks">¡Gracias por su preferencia!</div>
          <div>VERANO ESTATE - Experiencia Gourmet</div>
          <div>www.veranoestate.com</div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generar mensaje para WhatsApp
   * @param {Object} ticket - Ticket a formatear
   * @returns {string} Texto formateado
   */
  generarFormatoWhatsApp(ticket) {
    return this.ticketSystem ? this.ticketSystem.formatearWhatsApp(ticket) : '';
  }

  /**
   * Imprimir ticket
   * @param {string} ticketId - ID del ticket
   * @param {string} formato - 'thermal' | 'pdf'
   */
  async imprimir(ticketId, formato = 'thermal') {
    try {
      const ticket = await this.ticketSystem.obtenerTicket(ticketId);
      if (!ticket) {
        alert('❌ No se encontró el ticket');
        return;
      }

      // Crear ventana de impresión
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('❌ No se pudo abrir ventana de impresión. Verifica el bloqueador de ventanas emergentes.');
        return;
      }

      // Escribir contenido
      const html = formato === 'pdf' 
        ? this.generarFormatoPDF(ticket)
        : this.generarFormatoThermal(ticket);
      
      printWindow.document.write(html);
      printWindow.document.close();

      // Esperar a que cargue y luego imprimir
      printWindow.onload = function() {
        printWindow.focus();
        printWindow.print();
      };

      // Cerrar ventana después de imprimir (opcional)
      setTimeout(() => {
        printWindow.close();
      }, 1000);

    } catch (error) {
      console.error('❌ Error al imprimir:', error);
      alert('❌ Error al imprimir el ticket: ' + error.message);
    }
  }

  /**
   * Enviar ticket por WhatsApp
   * @param {Object} ticket - Ticket a enviar
   * @param {string} telefono - Número de teléfono (opcional)
   */
  enviarPorWhatsApp(ticket, telefono = '') {
    try {
      const mensaje = this.generarFormatoWhatsApp(ticket);
      const mensajeCodificado = encodeURIComponent(mensaje);
      
      // Si se proporciona teléfono, usarlo. Si no, solo abrir WhatsApp
      const url = telefono 
        ? `https://wa.me/${telefono}?text=${mensajeCodificado}`
        : `https://wa.me/?text=${mensajeCodificado}`;
      
      window.open(url, '_blank');
    } catch (error) {
      console.error('❌ Error al enviar por WhatsApp:', error);
      alert('❌ Error al abrir WhatsApp: ' + error.message);
    }
  }

  /**
   * Descargar tickets como CSV
   * @param {Array} tickets - Array de tickets
   * @param {string} filename - Nombre del archivo
   */
  descargarCSV(tickets, filename = 'tickets') {
    try {
      if (!tickets || tickets.length === 0) {
        alert('⚠️ No hay tickets para exportar');
        return;
      }

      // Crear encabezados CSV
      const headers = [
        'Numero',
        'Fecha',
        'Hora',
        'Cliente',
        'Mesero',
        'Items',
        'Subtotal',
        'Descuento',
        'IVA',
        'Propina',
        'Total',
        'Metodo',
        'Notas'
      ];

      // Crear filas CSV
      const rows = tickets.map(ticket => {
        const fecha = new Date(ticket.timestamp);
        const itemsResumen = ticket.items.map(i => `${i.cantidad}x ${i.nombre}`).join('; ');
        
        return [
          ticket.numero,
          fecha.toLocaleDateString('es-MX'),
          fecha.toLocaleTimeString('es-MX'),
          ticket.cliente,
          ticket.mesero,
          `"${itemsResumen}"`, // Comillas para valores con comas
          ticket.subtotal.toFixed(2),
          ticket.descuento.toFixed(2),
          ticket.iva.toFixed(2),
          ticket.propina.toFixed(2),
          ticket.total.toFixed(2),
          ticket.metodo,
          `"${ticket.notas || ''}"` // Quotes for values with commas
        ].join(',');
      });

      // Combinar encabezados y filas
      const csv = [headers.join(','), ...rows].join('\n');

      // Crear blob y descargar
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' }); // BOM para Excel
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      const timestamp = new Date().toISOString().split('T')[0];
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${timestamp}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('✅ CSV descargado correctamente');
    } catch (error) {
      console.error('❌ Error al descargar CSV:', error);
      alert('❌ Error al descargar CSV: ' + error.message);
    }
  }

  /**
   * Descargar estadísticas como CSV
   * @param {Object} stats - Objeto de estadísticas
   * @param {string} filename - Nombre del archivo
   */
  descargarEstadisticasCSV(stats, filename = 'estadisticas') {
    try {
      const rows = [
        ['Métrica', 'Valor'],
        ['Total Tickets', stats.totalTickets],
        ['Venta Total', stats.ventaTotal.toFixed(2)],
        ['Ticket Promedio', stats.ticketPromedio.toFixed(2)],
        ['Propinas Total', stats.propinasTotal.toFixed(2)],
        ['Descuentos Total', stats.descuentosTotal.toFixed(2)],
        ['IVA Total', stats.ivaTotal.toFixed(2)],
        [''],
        ['Método de Pago', 'Cantidad', 'Monto'],
        ['Efectivo', stats.porMetodo.efectivo.cantidad, stats.porMetodo.efectivo.monto.toFixed(2)],
        ['Tarjeta', stats.porMetodo.tarjeta.cantidad, stats.porMetodo.tarjeta.monto.toFixed(2)],
        ['Transferencia', stats.porMetodo.transferencia.cantidad, stats.porMetodo.transferencia.monto.toFixed(2)],
        [''],
        ['Top Productos', 'Cantidad', 'Total']
      ];

      if (stats.topProductos) {
        stats.topProductos.forEach(producto => {
          rows.push([producto.nombre, producto.cantidad, producto.total.toFixed(2)]);
        });
      }

      const csv = rows.map(row => row.join(',')).join('\n');
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      const timestamp = new Date().toISOString().split('T')[0];
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${timestamp}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('✅ Estadísticas CSV descargado correctamente');
    } catch (error) {
      console.error('❌ Error al descargar estadísticas CSV:', error);
      alert('❌ Error al descargar estadísticas: ' + error.message);
    }
  }

  // Utilidades de formateo
  formatMoney(amount) {
    return '$' + (amount || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
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

  capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}

// Crear instancia global
if (typeof window !== 'undefined') {
  window.TicketPrinter = TicketPrinter;
  window.TicketPrinterInstance = new TicketPrinter();
}
