// Berechnet den Gesamtumsatz aus einer Liste von Tickets
// tickets: Array<{ price: number, quantity?: number }>
export function calculateTotalRevenue(tickets = []) {
  if (!Array.isArray(tickets)) return 0;
  return tickets.reduce(
    (sum, ticket) => sum + (ticket.price || 0) * (ticket.quantity || 1),
    0
  );
}
