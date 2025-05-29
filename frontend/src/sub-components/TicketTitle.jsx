import React from 'react';
import '../styles/components.css';

export function TicketTitle({title, date}) {
    return (
        <div className="ticket-details">
            <div className="ticket-header">
                <h3 className="ticket-title">{title}</h3>
                <time className="ticket-date">{date}</time>
            </div>
        </div>
    );
}