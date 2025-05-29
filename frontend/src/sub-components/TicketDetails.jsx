import React, {useState} from 'react';
import '../styles/components.css';
import {TicketMemories} from "./TicketMemories.jsx";

export function TicketDetails({venue, location, event_description, event_image}) {
    const [open, setOpen] = useState(false);
    const toggle = () => setOpen((prev) => !prev);

    return (<>
        {open && (
        <div className="ticket-details">
            <div className="ticket-meta-grid">
                <div>
                    <dt className="ticket-meta-label">Venue</dt>
                    <dd className="ticket-meta-value">{venue}</dd>
                </div>
                <div>
                    <dt className="ticket-meta-label">Location</dt>
                    <dd className="ticket-meta-value">{location}</dd>
                </div>
            </div>
            <TicketMemories event_description={event_description} event_image={event_image}/>
        </div>
            )}

        <button type="button" onClick={toggle} className="chevron-btn">
           {open ? "...less" : "...more"}
        </button>
    </>);
}