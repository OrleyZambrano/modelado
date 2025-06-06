"use client";

import { useState } from 'react';

export default function TestSupabase() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult('Probando conexión...');

    try {
      const { createClient } = await import('@supabase/supabase-js');
      
      const supabaseUrl = 'https://nskkhyvjhkdzpnhmncqa.supabase.co';
      const supabaseKey = 'PEGA_AQUI_TU_ANON_KEY_CORRECTA';
      
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      console.log('Testing with URL:', supabaseUrl);
      console.log('Testing with Key:', supabaseKey.substring(0, 20) + '...');
      
      const { data, error } = await supabase
        .from('Movie')
        .select('*')
        .limit(1);

      if (error) {
        setResult(`Error: ${error.message}`);
      } else {
        setResult(`¡Éxito! Datos: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (err) {
      setResult(`Error de conexión: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Supabase Connection</h1>
      <button 
        onClick={testConnection}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {loading ? 'Probando...' : 'Probar Conexión'}
      </button>
      <pre className="bg-gray-100 p-4 rounded text-black">
        {result}
      </pre>
    </div>
  );
}
