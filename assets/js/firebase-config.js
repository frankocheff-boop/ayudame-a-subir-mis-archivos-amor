/**
 * Firebase Configuration for VERANO ESTATE
 * 
 * INSTRUCCIONES:
 * 1. Ve a Firebase Console: https://console.firebase.google.com
 * 2. Selecciona tu proyecto
 * 3. Ve a Project Settings > General > Your apps
 * 4. Copia tu firebaseConfig y reemplaza el objeto abajo
 * 
 * Para más detalles, consulta: docs/FIREBASE_SETUP.md
 */

// ⚠️ REEMPLAZAR ESTOS VALORES CON TUS CREDENCIALES DE FIREBASE
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "verano-estate-prod.firebaseapp.com",
  projectId: "verano-estate-prod",
  storageBucket: "verano-estate-prod.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

// Variables globales para Firebase
let firebaseApp = null;
let firebaseDb = null;
let isFirebaseInitialized = false;

/**
 * Inicializar Firebase
 */
function initializeFirebase() {
  try {
    // Verificar que Firebase esté disponible
    if (typeof firebase === 'undefined') {
      console.error('❌ Firebase SDK no está cargado. Asegúrate de incluir los scripts de Firebase.');
      return false;
    }

    // Verificar que las credenciales no sean placeholders
    if (firebaseConfig.apiKey === 'TU_API_KEY') {
      console.warn('⚠️ Firebase no configurado. Por favor configura tus credenciales en firebase-config.js');
      console.warn('📖 Consulta docs/FIREBASE_SETUP.md para instrucciones');
      return false;
    }

    // Inicializar Firebase App
    if (!firebase.apps.length) {
      firebaseApp = firebase.initializeApp(firebaseConfig);
      console.log('✅ Firebase App inicializado');
    } else {
      firebaseApp = firebase.app();
      console.log('✅ Firebase App ya estaba inicializado');
    }

    // Inicializar Firestore
    firebaseDb = firebase.firestore();
    
    // Configurar opciones de Firestore
    firebaseDb.settings({
      cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
    });

    // Habilitar persistencia offline
    firebaseDb.enablePersistence({ synchronizeTabs: true })
      .then(() => {
        console.log('✅ Persistencia offline habilitada');
      })
      .catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('⚠️ Persistencia offline no disponible (múltiples tabs abiertas)');
        } else if (err.code === 'unimplemented') {
          console.warn('⚠️ Persistencia offline no soportada en este navegador');
        }
      });

    isFirebaseInitialized = true;
    console.log('🔥 Firebase conectado correctamente');
    
    // Disparar evento personalizado
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('firebase-ready'));
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error al inicializar Firebase:', error);
    console.error('Detalles:', error.message);
    return false;
  }
}

/**
 * Obtener instancia de Firestore
 */
function getFirestore() {
  if (!isFirebaseInitialized) {
    console.error('❌ Firebase no está inicializado. Llama a initializeFirebase() primero.');
    return null;
  }
  return firebaseDb;
}

/**
 * Verificar estado de conexión
 */
function checkFirebaseConnection() {
  return isFirebaseInitialized;
}

/**
 * Obtener timestamp del servidor
 */
function getServerTimestamp() {
  if (!isFirebaseInitialized || !firebaseDb) {
    return new Date();
  }
  return firebase.firestore.FieldValue.serverTimestamp();
}

/**
 * Auto-inicializar Firebase cuando el DOM esté listo
 */
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFirebase);
  } else {
    // DOM ya está listo
    initializeFirebase();
  }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.firebaseConfig = firebaseConfig;
  window.initializeFirebase = initializeFirebase;
  window.getFirestore = getFirestore;
  window.checkFirebaseConnection = checkFirebaseConnection;
  window.getServerTimestamp = getServerTimestamp;
  window.isFirebaseInitialized = () => isFirebaseInitialized;
}
