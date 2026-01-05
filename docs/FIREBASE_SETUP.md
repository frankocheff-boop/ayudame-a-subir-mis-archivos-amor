# 🔥 Guía de Setup Firebase para VERANO ESTATE

## Paso 1: Crear Proyecto Firebase
1. Ve a https://firebase.google.com
2. Click "Get Started"
3. Login con tu cuenta de Gmail
4. Click "Add project"
5. Nombre del proyecto: `verano-estate-prod`
6. Deshabilita Google Analytics (no es necesario)
7. Click "Create project"

## Paso 2: Habilitar Firestore Database
1. En el menú lateral, click "Firestore Database"
2. Click "Create database"
3. Selecciona "Start in test mode"
4. Location: `us-central1` (o el más cercano a ti)
5. Click "Enable"

## Paso 3: Obtener Credenciales
1. Click en el ícono de configuración ⚙️
2. "Project settings"
3. Tab "General"
4. Scroll down hasta "Your apps"
5. Click en el ícono `</>` (Web)
6. App nickname: `VERANO ESTATE Web`
7. Click "Register app"
8. COPIA el objeto `firebaseConfig`

## Paso 4: Configurar en el Proyecto
1. Abre `assets/js/firebase-config.js`
2. Reemplaza las credenciales con las tuyas
3. Guarda el archivo

## Paso 5: Testing
1. Abre `pages/ticket-manager.html` en tu navegador
2. Deberías ver "Firebase conectado ✅" en la consola
3. Si hay errores, revisa las credenciales

## Paso 6: Configurar Reglas de Seguridad (IMPORTANTE)
En Firebase Console → Firestore → Rules, cambia a:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tickets/{ticketId} {
      allow read, write: if true; // Cambiar después con auth
    }
    match /cupones/{cuponId} {
      allow read: if true;
      allow write: if true; // Cambiar después con auth
    }
  }
}
```

## ¡Listo! 🎉
Tu sistema de tickets ya está conectado a Firebase.

## Notas de Seguridad

⚠️ **IMPORTANTE**: Las reglas actuales permiten acceso completo a todos los usuarios. Esto es apropiado SOLO para desarrollo y testing.

### Para Producción (Implementar después):
1. Activar Firebase Authentication
2. Configurar reglas basadas en roles
3. Limitar acceso solo a usuarios autenticados
4. Implementar validación de datos en las reglas
5. Habilitar logs de auditoría

## Troubleshooting

### Error: "Firebase not initialized"
- Verifica que las credenciales estén correctamente copiadas
- Asegúrate de que los scripts de Firebase estén cargados antes de firebase-config.js

### Error: "Permission denied"
- Verifica que las reglas de seguridad estén configuradas correctamente
- Asegúrate de estar en modo "test mode" para desarrollo

### Error: "Quota exceeded"
- Firebase Spark (gratis) tiene límites diarios
- Considera actualizar a plan Blaze si necesitas más capacidad

## Estructura de Datos

### Colección: tickets
```javascript
{
  numero: "VE-20260105-0001",
  timestamp: Timestamp,
  cliente: "Nombre del cliente",
  mesero: "Nombre del mesero",
  items: [{
    nombre: "Platillo",
    cantidad: 1,
    precio: 100.00,
    categoria: "Main",
    subtotal: 100.00
  }],
  subtotal: 100.00,
  descuento: 0.00,
  cupon: null,
  iva: 16.00,
  propina: 10.00,
  total: 126.00,
  metodo: "efectivo",
  notas: ""
}
```
