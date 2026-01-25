// ============================================
// COMPOSABLE: Gestión de Idioma de la Aplicación
// ============================================
// Estado global para el idioma seleccionado
// Idiomas soportados: 'ca' (Catalán), 'es' (Español), 'en' (Inglés)
// Por defecto se usa Catalán como idioma principal

export const useIdioma = () => useState('idioma_actual', () => 'ca');