"use client";

import { useEffect, useState } from "react";

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
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [movieTitle, setMovieTitle] = useState("");
  const [movieGenre, setMovieGenre] = useState("");
  const [ticketSeat, setTicketSeat] = useState("");
  const [ticketBuyer, setTicketBuyer] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);

  useEffect(() => {
    fetchMovies();
    fetchTickets();
  }, []);

  async function fetchMovies() {
    setLoading(true);
    const res = await fetch("/api/movies");
    const data = await res.json();
    setMovies(data);
    setLoading(false);
  }

  async function fetchTickets() {
    const res = await fetch("/api/tickets");
    const data = await res.json();
    setTickets(data);
  }

  async function handleAddMovie(e: React.FormEvent) {
    e.preventDefault();
    if (!movieTitle || !movieGenre) return;
    await fetch("/api/movies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: movieTitle, genre: movieGenre })
    });
    setMovieTitle("");
    setMovieGenre("");
    fetchMovies();
  }

  async function handleAddTicket(e: React.FormEvent) {
    e.preventDefault();
    if (!ticketSeat || !ticketBuyer || !selectedMovie) return;
    await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seat: ticketSeat, buyer: ticketBuyer, movie_id: selectedMovie })
    });
    setTicketSeat("");
    setTicketBuyer("");
    setSelectedMovie(null);
    fetchTickets();
    fetchMovies();
  }

  async function handleDeleteMovie(id: number) {
    await fetch("/api/movies", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    fetchMovies();
    fetchTickets();
  }

  async function handleDeleteTicket(id: number) {
    await fetch("/api/tickets", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    fetchTickets();
    fetchMovies();
  }

  return (
    <div className="min-h-screen p-8 pb-20 font-[family-name:var(--font-geist-sans)] bg-white dark:bg-black">
      <main className="p-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Películas y Tickets</h1>
        <form onSubmit={handleAddMovie} className="mb-6 flex gap-2 flex-wrap">
          <input
            className="border px-2 py-1 rounded"
            placeholder="Título de la película"
            value={movieTitle}
            onChange={(e) => setMovieTitle(e.target.value)}
          />
          <input
            className="border px-2 py-1 rounded"
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
            className="border px-2 py-1 rounded"
            placeholder="Asiento"
            value={ticketSeat}
            onChange={(e) => setTicketSeat(e.target.value)}
          />
          <input
            className="border px-2 py-1 rounded"
            placeholder="Comprador"
            value={ticketBuyer}
            onChange={(e) => setTicketBuyer(e.target.value)}
          />
          <select
            className="border px-2 py-1 rounded"
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
      </main>
    </div>
  );
}
