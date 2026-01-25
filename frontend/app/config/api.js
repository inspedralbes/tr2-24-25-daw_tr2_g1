// Configuración automática de API URL según el entorno
// Si estás en localhost, usa el backend local
// Si estás en producción (edupi.daw.inspedralbes.cat), usa el backend de producción

export const getApiUrl = () => {
  // Detectar si estamos en el navegador
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Si hostname es localhost o 127.0.0.1, usar backend local
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3000';
    }
    
    // Si estamos en producción, usar el dominio de producción
    if (hostname === 'edupi.daw.inspedralbes.cat') {
      return 'http://edupi.daw.inspedralbes.cat';
    }
  }
  
  // Fallback por defecto (desarrollo)
  return 'http://localhost:3000';
};

// Exportar la URL directamente para uso sencillo
export const API_URL = getApiUrl();
