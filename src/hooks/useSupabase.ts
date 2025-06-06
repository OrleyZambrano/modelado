import { useState, useEffect } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';

interface SupabaseConfig {
  client: SupabaseClient | null;
  isConfigured: boolean;
  error: string | null;
}

export const useSupabase = (): SupabaseConfig => {
  const [client, setClient] = useState<SupabaseClient | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeSupabase = async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        
        // Configuración embebida para Azure Static Web Apps
        const config = {
          url: 'https://nskkhyvjhkdzpnhmncqa.supabase.co',
          // Nueva anon public key correcta de Supabase
          key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5za2toeXZqaGtkenBuaG1uY3FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0OTAwODQsImV4cCI6MjA2NDA2NjA4NH0.swkMddYG1B6ve4dxDnKd-SulMYB2Vqv-k9LO7b5dSR4'
        };

        console.log('Inicializando Supabase con URL:', config.url);
        console.log('Key starts with:', config.key.substring(0, 20) + '...');

        const supabaseClient = createClient(config.url, config.key, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false
          }
        });

        setClient(supabaseClient);
        setIsConfigured(true);
        setError(null);
        console.log('Cliente Supabase configurado y listo');
        
      } catch (err) {
        console.error('Error crítico inicializando Supabase:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido al configurar Supabase');
        setClient(null);
        setIsConfigured(false);
      }
    };

    if (typeof window !== 'undefined') {
      initializeSupabase();
    }
  }, []);

  return { client, isConfigured, error };
};
