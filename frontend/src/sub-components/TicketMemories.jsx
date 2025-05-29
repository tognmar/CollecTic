import React from 'react';
import '../styles/components.css';

export function TicketMemories({event_description, event_image}) {
    return (<>
        {(event_description && <>
            <label className="label pt-5">
                <span className="form-label text-secondary">The memories in words…</span>
            </label>
            <p className="ticket-description-memory">
                {event_description || ''}
            </p>
        </>)}
        {(event_image && <>
            <label className="label pt-5">
                <span className="form-label text-primary">The memories in thousand words…</span>
            </label>
            <div className="mt-2">
                <img
                    src={event_image}
                    alt="Event Memory"
                    className="event-memory-image"
                />
            </div>
        </>)}
    </>)
}