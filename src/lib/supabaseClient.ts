import { createClient } from '@supabase/supabase-js';

// Variables de entorno para Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Crear cliente solo si tenemos las credenciales
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper para verificar si Supabase está disponible
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabase);
};

// Log de configuración para debugging (solo en desarrollo)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('Supabase Config:', {
    url: supabaseUrl ? 'Configured' : 'Missing',
    key: supabaseAnonKey ? 'Configured' : 'Missing',
    client: supabase ? 'Created' : 'Not created'
  });
}
