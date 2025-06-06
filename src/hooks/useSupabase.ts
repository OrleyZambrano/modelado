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

        const supabaseClient = createClient(config.url, config.key, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false
          },
          global: {
            headers: {
              'apikey': config.key,
              'Authorization': `Bearer ${config.key}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            }
          },
          db: {
            schema: 'public'
          }
        });

        // Verificar conectividad
        const { error: testError } = await supabaseClient
          .from('Movie')
          .select('count(*)', { count: 'exact', head: true })
          .limit(1);

        if (testError) {
          console.error('Error de conectividad Supabase:', testError);
          setError(`Error de conectividad: ${testError.message}`);
          return;
        }

        setClient(supabaseClient);
        setIsConfigured(true);
        setError(null);
        console.log('Supabase configurado correctamente');
        
      } catch (err) {
        console.error('Error inicializando Supabase:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
    };

    if (typeof window !== 'undefined') {
      initializeSupabase();
    }
  }, []);

  return { client, isConfigured, error };
};
