'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import { Trash2, Loader, AlertCircle } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

export default function TicketVerwaltungsPage() {
    const { isLoaded, isSignedIn, userId } = useAuth();
    const router = useRouter();
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelingTicketId, setCancelingTicketId] = useState(null);

    // Tickets abrufen
    useEffect(() => {
        async function fetchTickets() {
            if (!isLoaded || !isSignedIn) return;
            
            try {
                setIsLoading(true);
                const response = await fetch('/api/tickets', {
                    credentials: 'include'
                });
                
                if (!response.ok) throw new Error('Tickets konnten nicht geladen werden');
                
                const data = await response.json();
                setTickets(data.tickets || []);
            } catch (err) {
                setError(err.message);
                console.error('Fehler beim Laden der Tickets:', err);
            } finally {
                setIsLoading(false);
            }
        }
        
        fetchTickets();
    }, [isLoaded, isSignedIn]);

    // Ticket-Stornierung
    const handleCancelTicket = async (ticketId) => {
        if (!confirm('Sind Sie sicher, dass Sie dieses Ticket stornieren möchten? Dieser Vorgang kann nicht rückgängig gemacht werden.')) {
            return;
        }
        
        try {
            setCancelingTicketId(ticketId);
            const response = await fetch(`/api/tickets/${ticketId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ticket konnte nicht storniert werden');
            }
            
            // Nach erfolgreicher Löschung die Liste aktualisieren
            setTickets(tickets.filter(ticket => ticket._id !== ticketId));
        } catch (err) {
            alert(`Fehler: ${err.message}`);
            console.error('Fehler bei der Ticket-Stornierung:', err);
        } finally {
            setCancelingTicketId(null);
        }
    };

    if (!isLoaded) return <div className="py-20 text-center">Wird geladen...</div>;
    
    if (!isSignedIn) {
        router.push('/sign-in');
        return <div className="py-20 text-center">Sie werden zur Anmeldeseite weitergeleitet...</div>;
    }

    return (
        <>
            <NavBar />
            <main className="max-w-5xl mx-auto px-6 py-16">
                <div className="bg-[#0f172a] text-white rounded-2xl shadow-2xl overflow-hidden p-8 mt-10">
                    <h1 className="text-3xl font-extrabold text-center text-white mb-8">
                        Meine Tickets
                    </h1>
                    
                    {isLoading && (
                        <div className="py-12 flex justify-center">
                            <Loader size={40} className="animate-spin text-pink-500" />
                        </div>
                    )}
                    
                    {error && !isLoading && (
                        <div className="py-8 flex flex-col items-center">
                            <AlertCircle size={40} className="text-red-500 mb-4" />
                            <h3 className="text-xl font-bold">Ein Fehler ist aufgetreten</h3>
                            <p className="text-gray-400 mt-2">{error}</p>
                        </div>
                    )}
                    
                    {!isLoading && !error && tickets.length === 0 && (
                        <div className="py-12 text-center">
                            <p className="text-gray-400">Sie haben noch keine Tickets gekauft.</p>
                        </div>
                    )}
                    
                    {!isLoading && !error && tickets.length > 0 && (
                        <div className="space-y-6">
                            {tickets.map(ticket => (
                                <div key={ticket._id} className="border border-gray-700 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-bold">{ticket.eventTitle}</h2>
                                        <button
                                            onClick={() => handleCancelTicket(ticket._id)}
                                            disabled={cancelingTicketId === ticket._id}
                                            className={`p-2 rounded-full ${
                                                cancelingTicketId === ticket._id
                                                    ? "bg-gray-600"
                                                    : "bg-red-600 hover:bg-red-700"
                                            } transition-colors`}
                                        >
                                            {cancelingTicketId === ticket._id ? (
                                                <Loader size={18} className="animate-spin" />
                                            ) : (
                                                <Trash2 size={18} />
                                            )}
                                        </button>
                                    </div>
                                    
                                    <div className="mt-4 grid grid-cols-2 gap-2">
                                        <p><span className="text-gray-400">Datum:</span> {ticket.date}</p>
                                        <p><span className="text-gray-400">Ort:</span> {ticket.location}</p>
                                        <p><span className="text-gray-400">Anzahl der Tickets:</span> {ticket.quantity}</p>
                                        <p><span className="text-gray-400">Gesamt:</span> {ticket.totalPrice + ticket.totalDonation}€</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}