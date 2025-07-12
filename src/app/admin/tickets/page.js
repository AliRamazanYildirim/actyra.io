"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { 
  Ticket, 
  User, 
  Calendar, 
  DollarSign, 
  Search, 
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/admin/tickets');
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/tickets/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Ticket-Statistiken:', error);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return { 
          icon: CheckCircle, 
          label: 'Abgeschlossen', 
          color: 'text-green-500',
          bg: 'bg-green-500/10'
        };
      case 'pending':
        return { 
          icon: Clock, 
          label: 'Ausstehend', 
          color: 'text-yellow-500',
          bg: 'bg-yellow-500/10'
        };
      case 'failed':
        return { 
          icon: XCircle, 
          label: 'Fehlgeschlagen', 
          color: 'text-red-500',
          bg: 'bg-red-500/10'
        };
      default:
        return { 
          icon: Clock, 
          label: 'Unbekannt', 
          color: 'text-gray-500',
          bg: 'bg-gray-500/10'
        };
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.eventTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || ticket.paymentStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-700 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Ticket-Verwaltung</h1>
        <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-200 flex items-center">
          <Download className="w-4 h-4 mr-2" />
          Exportieren
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Gesamt Tickets</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <Ticket className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Abgeschlossen</p>
              <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Ausstehend</p>
              <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Fehlgeschlagen</p>
              <p className="text-2xl font-bold text-red-500">{stats.failed}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Gesamtumsatz</p>
              <p className="text-2xl font-bold text-white">€{stats.totalRevenue.toLocaleString('de-DE')}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Nach Event, Kunde oder Bestellnummer suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Alle Status</option>
            <option value="completed">Abgeschlossen</option>
            <option value="pending">Ausstehend</option>
            <option value="failed">Fehlgeschlagen</option>
          </select>

          <button className="px-4 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white hover:bg-[#334155] transition-colors flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Erweiterte Filter
          </button>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-[#0f172a] border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1e293b]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Bestellnummer</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Event</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Kunde</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Anzahl</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Gesamtpreis</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Datum</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredTickets.map((ticket) => {
                const statusConfig = getStatusConfig(ticket.paymentStatus);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <tr key={ticket._id} className="hover:bg-[#1e293b]/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-white">
                      #{ticket.orderNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-white line-clamp-1">
                          {ticket.eventTitle}
                        </p>
                        <p className="text-xs text-gray-400">
                          {ticket.location}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-white">
                          {ticket.customerName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {ticket.customerEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {ticket.quantity}x
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-white">
                      €{ticket.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig.label}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {format(new Date(ticket.purchaseDate), 'dd.MM.yyyy HH:mm', { locale: de })}
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-[#334155] rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Keine Tickets gefunden.</p>
            <p className="text-gray-500 text-sm mt-2">
              Versuchen Sie, Ihre Suchkriterien zu ändern.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
