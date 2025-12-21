# VERANO ESTATE - Sistema de Gestión Integral

Sistema completo de gestión para restaurantes y hoteles boutique desarrollado por Chef Franko.

## 🌟 Características

Este repositorio contiene tres sistemas principales:

### 1. POS NEON ⚡
Sistema de punto de venta con diseño cyberpunk moderno
- Interfaz futurista con efectos neon
- Búsqueda en tiempo real
- Gestión de categorías y productos
- Carrito de compras inteligente
- Múltiples métodos de pago

### 2. POS Restaurant 🍽️
Sistema profesional para operaciones de restaurante
- Diseño limpio y profesional
- Gestión de órdenes por mesa
- Control de inventario
- Múltiples métodos de pago (Efectivo, Tarjeta, Cargo a Habitación, Transferencia)

### 3. Formulario de Huéspedes 🏨
Sistema completo de gestión de reservaciones
- Asignación de habitaciones
- Validación de datos en tiempo real
- Integración con WhatsApp
- Cálculo automático de servicios
- Persistencia de datos con localStorage
- Soporte multi-idioma (Español/Inglés)

## 📁 Estructura del Proyecto

```
ayudame-a-subir-mis-archivos-amor/
├── assets/
│   ├── css/
│   │   ├── pos-neon.css           # Estilos para POS Neon
│   │   ├── pos-restaurant.css     # Estilos para POS Restaurant
│   │   └── guest-form.css         # Estilos para formulario de huéspedes
│   ├── js/
│   │   ├── pos-neon.js            # Lógica POS Neon
│   │   ├── pos-restaurant.js      # Lógica POS Restaurant
│   │   ├── guest-form.js          # Lógica formulario de huéspedes
│   │   └── i18n.js                # Sistema de internacionalización
│   └── images/
│       └── wifi-info.png          # Información de WiFi
├── pages/
│   ├── pos-neon.html              # Página POS Neon
│   ├── pos-restaurant.html        # Página POS Restaurant
│   └── guest-form.html            # Página formulario de huéspedes
├── locales/
│   ├── es.json                    # Traducciones en español
│   └── en.json                    # Traducciones en inglés
├── index.html                     # Página de inicio
└── README.md                      # Este archivo
```

## 🚀 Instalación y Uso

### Requisitos
- Un navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet (para cargar Tailwind CSS desde CDN)

### Instalación Local

1. Clona el repositorio:
```bash
git clone https://github.com/frankocheff-boop/ayudame-a-subir-mis-archivos-amor.git
cd ayudame-a-subir-mis-archivos-amor
```

2. Abre `index.html` en tu navegador o usa un servidor local:
```bash
# Usando Python
python -m http.server 8000

# Usando Node.js
npx serve

# Luego abre http://localhost:8000 en tu navegador
```

### Deployment en GitHub Pages

Este proyecto está configurado para funcionar perfectamente con GitHub Pages:

1. Ve a la configuración de tu repositorio en GitHub
2. Navega a "Pages" en el menú lateral
3. Selecciona la rama principal (main/master) como fuente
4. Guarda los cambios
5. El sitio estará disponible en: `https://[usuario].github.io/[repositorio]/`

## 💻 Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos personalizados y animaciones
- **JavaScript (ES6+)**: Lógica de aplicación
- **Tailwind CSS**: Framework CSS utility-first (via CDN)
- **localStorage API**: Persistencia de datos del cliente
- **WhatsApp Web API**: Integración con WhatsApp

## 🌐 Sistema de Traducción (i18n)

El proyecto incluye un sistema completo de internacionalización:

### Idiomas Soportados
- Español (es) - Idioma por defecto
- Inglés (en)

### Cómo Usar las Traducciones

Usa atributos `data-i18n` en HTML:
```html
<h1 data-i18n="header.title">VERANO ESTATE</h1>
<button data-i18n="form.submit">Enviar</button>
```

Para agregar nuevos idiomas, crea un archivo JSON en `locales/`:
```json
{
  "header": {
    "title": "VERANO ESTATE",
    "subtitle": "Texto traducido"
  }
}
```

## 📱 Integración con WhatsApp

El formulario de huéspedes incluye integración con WhatsApp para enviar reservaciones:

### Configuración
El número de WhatsApp está en `assets/js/guest-form.js`:
```javascript
const phoneNumber = '523221606843'; // +52 322 160 6843
```

### Formato del Mensaje
El sistema genera un mensaje formateado con:
- Información de contacto
- Fechas de estadía
- Asignación de habitaciones
- Servicios solicitados con precios
- Total calculado

## 🎨 Personalización

### Colores de Marca

**Guest Form** (`assets/css/guest-form.css`):
```css
:root {
    --brand-teal: #003C3C;
    --brand-bg: #FBF7F0;
}
```

**POS Neon** (`assets/css/pos-neon.css`):
```css
:root {
    --neon-bg: #050b14;
    --neon-cyan: #06b6d4;
    --neon-bright: #22d3ee;
}
```

### Precios de Servicios

Los precios están configurados en `assets/js/guest-form.js`:
```javascript
let servicesPrices = {
    breakfast: 120,   // MXN por persona
    lunch: 180,       // MXN por persona
    dinner: 595,      // MXN por persona
    openBar: 110      // MXN por persona
};
```

## 🔧 Funciones Principales

### Formulario de Huéspedes

```javascript
// Validación
validateEmail(email)       // Valida formato de email
validatePhone(phone)       // Valida formato de teléfono
validateForm()            // Valida todo el formulario

// Gestión de Huéspedes
addGuestRow()             // Agrega un huésped
removeGuestRow(guestId)   // Elimina un huésped
updateGuestTable()        // Actualiza la tabla

// Servicios
calculateServices()       // Calcula costos
updateServicesSummary()   // Actualiza resumen

// WhatsApp
generateWhatsAppMessage() // Genera mensaje
sendToWhatsApp()         // Envía a WhatsApp

// Persistencia
loadFormData()           // Carga desde localStorage
saveFormData()           // Guarda en localStorage
clearFormData()          // Limpia datos
```

## 🐛 Resolución de Problemas

### El formulario no guarda datos
- Verifica que localStorage esté habilitado en tu navegador
- Revisa la consola del navegador para ver errores

### Las traducciones no funcionan
- Asegúrate de que los archivos JSON en `locales/` sean válidos
- Verifica que el servidor esté sirviendo los archivos correctamente
- Comprueba la consola del navegador

### WhatsApp no se abre
- Verifica el formato del número de teléfono (sin espacios ni guiones)
- Asegúrate de tener WhatsApp instalado o acceso a WhatsApp Web

## 📝 Licencia

© 2025 VERANO ESTATE by Chef Franko. Todos los derechos reservados.

## 👨‍🍳 Contacto

**VERANO ESTATE**
- 📞 Teléfono: +52 322 160 6843
- 📧 Email: franko@veranostate.com
- 📍 Ubicación: Puerto Vallarta, México
- 🌐 Instagram: [@veranostate](https://www.instagram.com/veranostate/)

## 📅 Historial de Versiones

### v2.0.0 (2025)
- ✅ Reorganización completa de la estructura del proyecto
- ✅ Separación de CSS y JavaScript en archivos dedicados
- ✅ Sistema de internacionalización (i18n) completo
- ✅ Formulario de huéspedes completamente funcional
- ✅ Integración con WhatsApp
- ✅ Persistencia con localStorage
- ✅ Validación de formularios en tiempo real
- ✅ Diseño responsive mejorado
- ✅ Nueva página de inicio con navegación

### v1.0.0
- 🎉 Versión inicial con sistemas POS básicos
