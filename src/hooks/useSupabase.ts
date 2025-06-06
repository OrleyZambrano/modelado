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
          key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5za2toeXZqaGtkenBuaG1uY3FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3NDk1NTQsImV4cCI6MjA1MzMyNTU1NH0.uE7hk_7fvPb6_2_jKp9HX7lXmN42kYK6BZbdgQ8mCRo'
        };

        console.log('Inicializando Supabase con URL:', config.url);

        const supabaseClient = createClient(config.url, config.key, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false
          }
        });

        // Test simple sin usar headers personalizados
        try {
          const { data: testData, error: testError } = await supabaseClient
            .from('Movie')
            .select('id')
            .limit(1);

          if (testError) {
            console.warn('Error en test inicial, pero continuando:', testError);
            // No fallar aquí, solo advertir
          } else {
            console.log('Test de conectividad exitoso:', testData);
          }
        } catch (testErr) {
          console.warn('Test de conectividad falló, pero continuando:', testErr);
          // No fallar aquí, permitir que el usuario intente usar el cliente
        }

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
