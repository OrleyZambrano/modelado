"use client";

import { useEffect, useState, useCallback } from "react";
import { useSupabase } from "../hooks/useSupabase";

interface Movie {
  id: number;
  title: string;
  genre: string;
  tickets?: Ticket[];
}

interface Ticket {
  id: number;
  seat: string;
  movie_id: number;
  buyer: string;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [movieTitle, setMovieTitle] = useState("");
  const [movieGenre, setMovieGenre] = useState("");
  const [ticketSeat, setTicketSeat] = useState("");
  const [ticketBuyer, setTicketBuyer] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  // Detectar si estamos en Azure (no hay APIs) o Google Cloud Run (con APIs)
  const isAzure = typeof window !== 'undefined' && window.location.hostname.includes('azurestaticapps.net');

  // Usar el hook personalizado de Supabase
  const { client: supabase, isConfigured, error: supabaseError } = useSupabase();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Actualizar error si hay problema con Supabase (solo para Azure)
  useEffect(() => {
    if (supabaseError && isAzure) {
      setError(supabaseError);
    }
  }, [supabaseError, isAzure]);

  const fetchMovies = useCallback(async () => {
    if (!mounted) return;
    
    try {
      setLoading(true);
      setError(null);
      
      if (isAzure && supabase) {
        console.log('Fetching movies from Supabase...');
        // Usar Supabase directamente en Azure - intentar sin relaciones primero
        const { data, error: supabaseError } = await supabase
          .from('Movie')
          .select('*')
          .order('id', { ascending: true });
        
        if (supabaseError) {
          console.error('Error de Supabase:', supabaseError);
          throw supabaseError;
        }
        console.log('Movies fetched successfully:', data);
        setMovies(data || []);
      } else if (!isAzure) {
        // Usar API en Google Cloud Run
        const res = await fetch("/api/movies");
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Error from API:', res.status, errorText);
          // Solo mostrar error genérico, no el detalle técnico
          throw new Error('Error al conectar con la base de datos');
        }
        
        const data = await res.json();
        setMovies(Array.isArray(data) ? data : []);
      } else if (isAzure && !supabase) {
        setError('Configurando conexión con la base de datos...');
      }
    } catch (err) {
      console.error('Error fetching movies:', err);
      // Para Google Cloud Run, solo mostrar mensaje genérico
      if (!isAzure) {
        setError('Error al cargar datos. Intenta recargar la página.');
      } else {
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar películas');
      }
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [isAzure, supabase, mounted]);

  const fetchTickets = useCallback(async () => {
    if (!mounted) return;
    
    try {
      setError(null);
      
      if (isAzure && supabase) {
        console.log('Fetching tickets from Supabase...');
        // Usar Supabase directamente en Azure
        const { data, error: supabaseError } = await supabase
          .from('Ticket')
          .select('*')
          .order('id', { ascending: true });
        
        if (supabaseError) {
          console.error('Error de Supabase en tickets:', supabaseError);
          throw supabaseError;
        }
        console.log('Tickets fetched successfully:', data);
        setTickets(data || []);
      } else if (!isAzure) {
        // Usar API en Google Cloud Run
        const res = await fetch("/api/tickets");
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Error from tickets API:', res.status, errorText);
          // No mostrar error para tickets, solo logear
          return;
        }
        
        const data = await res.json();
        setTickets(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
      // Para Google Cloud Run, no mostrar error de tickets
      if (isAzure) {
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar tickets');
        setTickets([]);
      }
    }
  }, [isAzure, supabase, mounted]);

  useEffect(() => {
    if (mounted && ((supabase) || !isAzure)) {
      fetchMovies();
      fetchTickets();
    }
  }, [fetchMovies, fetchTickets, mounted, supabase, isAzure]);

  async function handleAddMovie(e: React.FormEvent) {
    e.preventDefault();
    if (!movieTitle || !movieGenre) return;
    
    try {
      setError(null);
      
      if (isAzure && supabase) {
        // Usar Supabase directamente en Azure
        const { error: supabaseError } = await supabase
          .from('Movie')
          .insert([{ title: movieTitle, genre: movieGenre }]);
        
        if (supabaseError) throw supabaseError;
      } else if (!isAzure) {
        // Usar API en Google Cloud Run
        const res = await fetch("/api/movies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: movieTitle, genre: movieGenre })
        });
        
        if (!res.ok) {
          console.error('Error adding movie:', res.status);
          throw new Error('Error al agregar película');
        }
      }
      
      setMovieTitle("");
      setMovieGenre("");
      await fetchMovies();
    } catch (err) {
      console.error('Error adding movie:', err);
      setError(err instanceof Error ? err.message : 'Error al agregar película');
    }
  }

  async function handleAddTicket(e: React.FormEvent) {
    e.preventDefault();
    if (!ticketSeat || !ticketBuyer || !selectedMovie) return;
    
    try {
      setError(null);
      
      if (isAzure && supabase) {
        // Usar Supabase directamente en Azure
        const { error: supabaseError } = await supabase
          .from('Ticket')
          .insert([{ seat: ticketSeat, buyer: ticketBuyer, movie_id: selectedMovie }]);
        
        if (supabaseError) throw supabaseError;
      } else if (!isAzure) {
        // Usar API en Google Cloud Run
        const res = await fetch("/api/tickets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ seat: ticketSeat, buyer: ticketBuyer, movie_id: selectedMovie })
        });
        
        if (!res.ok) {
          console.error('Error adding ticket:', res.status);
          throw new Error('Error al agregar ticket');
        }
      }
      
      setTicketSeat("");
      setTicketBuyer("");
      setSelectedMovie(null);
      await fetchTickets();
      await fetchMovies();
    } catch (err) {
      console.error('Error adding ticket:', err);
      setError(err instanceof Error ? err.message : 'Error al agregar ticket');
    }
  }

  async function handleDeleteMovie(id: number) {
    try {
      setError(null);
      
      if (isAzure && supabase) {
        // Usar Supabase directamente en Azure
        const { error: supabaseError } = await supabase
          .from('Movie')
          .delete()
          .eq('id', id);
        
        if (supabaseError) throw supabaseError;
      } else if (!isAzure) {
        // Usar API en Google Cloud Run
        const res = await fetch("/api/movies", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id })
        });
        
        if (!res.ok) {
          console.error('Error deleting movie:', res.status);
          throw new Error('Error al eliminar película');
        }
      }
      
      await fetchMovies();
      await fetchTickets();
    } catch (err) {
      console.error('Error deleting movie:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar película');
    }
  }

  async function handleDeleteTicket(id: number) {
    try {
      setError(null);
      
      if (isAzure && supabase) {
        // Usar Supabase directamente en Azure
        const { error: supabaseError } = await supabase
          .from('Ticket')
          .delete()
          .eq('id', id);
        
        if (supabaseError) throw supabaseError;
      } else if (!isAzure) {
        // Usar API en Google Cloud Run
        const res = await fetch("/api/tickets", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id })
        });
        
        if (!res.ok) {
          console.error('Error deleting ticket:', res.status);
          throw new Error('Error al eliminar ticket');
        }
      }
      
      await fetchTickets();
      await fetchMovies();
    } catch (err) {
      console.error('Error deleting ticket:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar ticket');
    }
  }

  // Mostrar loading hasta que el componente esté montado
  if (!mounted) {
    return (
      <div className="min-h-screen p-8 pb-20 font-[family-name:var(--font-geist-sans)] bg-white dark:bg-black">
        <main className="p-8 max-w-xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Películas y Tickets</h1>
          <p>Cargando aplicación...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 pb-20 font-[family-name:var(--font-geist-sans)] bg-white dark:bg-black">
      <main className="p-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          Películas y Tickets 
          {isAzure && <span className="text-blue-500 text-sm">(Azure - Supabase Direct)</span>}
          {!isAzure && <span className="text-green-500 text-sm">(Google Cloud Run - API)</span>}
        </h1>
        
        {/* Mostrar estado de configuración en Azure */}
        {isAzure && !supabase && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <strong>Configurando:</strong> Estableciendo conexión con la base de datos...
          </div>
        )}
        
        {/* Mostrar información de debug solo en Azure */}
        {isAzure && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4 text-xs">
            <strong>Debug:</strong> 
            Client: {supabase ? 'Ready' : 'Not ready'} | 
            Configured: {isConfigured ? 'Yes' : 'No'} | 
            Error: {supabaseError || 'None'}
          </div>
        )}
        
        {/* Solo mostrar errores críticos que afecten la funcionalidad */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <form onSubmit={handleAddMovie} className="mb-6 flex gap-2 flex-wrap">
          <input
            className="border px-2 py-1 rounded text-black"
            placeholder="Título de la película"
            value={movieTitle}
            onChange={(e) => setMovieTitle(e.target.value)}
          />
          <input
            className="border px-2 py-1 rounded text-black"
            placeholder="Género"
            value={movieGenre}
            onChange={(e) => setMovieGenre(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-4 py-1 rounded" type="submit">
            Agregar película
          </button>
        </form>
        
        <form onSubmit={handleAddTicket} className="mb-6 flex gap-2 flex-wrap">
          <input
            className="border px-2 py-1 rounded text-black"
            placeholder="Asiento"
            value={ticketSeat}
            onChange={(e) => setTicketSeat(e.target.value)}
          />
          <input
            className="border px-2 py-1 rounded text-black"
            placeholder="Comprador"
            value={ticketBuyer}
            onChange={(e) => setTicketBuyer(e.target.value)}
          />
          <select
            className="border px-2 py-1 rounded text-black"
            value={selectedMovie ?? ''}
            onChange={e => setSelectedMovie(Number(e.target.value))}
          >
            <option value="">Selecciona película</option>
            {movies.map(m => (
              <option key={m.id} value={m.id}>{m.title}</option>
            ))}
          </select>
          <button className="bg-green-600 text-white px-4 py-1 rounded" type="submit">
            Agregar ticket
          </button>
        </form>
        
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div>
            {movies.length === 0 ? (
              <p className="text-gray-500">No hay películas disponibles. {error ? 'Verifica la conexión a la base de datos.' : 'Agrega la primera película.'}</p>
            ) : (
              <ul>
                {movies.map((m) => (
                  <li key={m.id} className="mb-4 border-b pb-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{m.title} ({m.genre})</span>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDeleteMovie(m.id)}
                      >
                        Eliminar película
                      </button>
                    </div>
                    <ul className="ml-4 mt-2">
                      {tickets.filter(t => t.movie_id === m.id).map(t => (
                        <li key={t.id} className="flex justify-between items-center">
                          <span>- Asiento {t.seat} | Comprador: {t.buyer}</span>
                          <button
                            className="text-red-400 hover:underline text-xs"
                            onClick={() => handleDeleteTicket(t.id)}
                          >
                            Eliminar ticket
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
