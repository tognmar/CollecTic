import React from 'react';
import {format} from 'date-fns';
import {Film, Landmark, Music, Volleyball} from 'lucide-react';
import {TicketImage} from "../../sub-components/TicketImage.jsx";
import {TicketDetails} from "../../sub-components/TicketDetails.jsx";
import {TicketActions} from "../../sub-components/TicketActions.jsx";
import {TicketTitle} from "../../sub-components/TicketTitle.jsx";


const iconMap = {music: Music, sports: Volleyball, shows: Film, attractions: Landmark};

export default function TicketSingle({ticket, onClick}) {
    const Icon = iconMap[ticket.category];
    const safeDate = (() => {
        try {
            return format(new Date(ticket.date), 'MMMM dd, yyyy');
        } catch {
            return ticket.date;
        }
    })();


    return (
        <div className={"ticket-card"}>
        <figure onClick={onClick} >
            <TicketImage src={ticket.ticket_image} title={ticket.title_artist} Icon={Icon}/>
        </figure>
            <TicketTitle title={ticket.title_artist} date={safeDate}/>
            <TicketDetails venue={ticket.venue} location={ticket.location} event_image={ticket.event_image} event_description={ticket.text}/>
            <TicketActions likes={ticket.likes || 0} comments={ticket.comments || 0}/>
        </div>
    );
}