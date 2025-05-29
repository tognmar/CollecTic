import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import TicketSingle from "../TicketSingle";
import NoTicketsAvailable from "../NoTicketsAvailable";

export default function MyTickets({ error, isFetching }) {
  const tickets = useSelector((s) => s.UserTickets.tickets);
  const navigate = useNavigate();
  const [editingTicketId, setEditingTicketId] = useState(null);

  // 1) Loading
  if (isFetching) {
    return (
      <div className="flex justify-center p-6">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  // 2) Error
  if (error) {
    return (
      <div className="p-4 text-error">
        Error fetching tickets: {typeof error === "string" ? error : error.message}
      </div>
    );
  }

  // 3) Empty
  if (!tickets || tickets.length === 0) {
    return <NoTicketsAvailable />;
  }

  // 4) Render list + edit modal
  return (
    <div className="mt-4 px-4 pb-4 space-y-6">
      {[...tickets]
     .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
     .map((ticket) => (
      <TicketSingle
        key={ticket.id}
        ticket={ticket}
        onClick={() => navigate(`/ticket/${ticket.id}`)}
        onEdit={() => setEditingTicketId(ticket.id)}
      />
     ))}
    </div>
  )}

