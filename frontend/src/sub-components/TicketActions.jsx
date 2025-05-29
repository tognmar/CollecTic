import React from 'react';
import {Heart, MessageCircle, Share2} from 'lucide-react';
import '../styles/components.css';

export function TicketActions({likes, comments}) {
    return (
        <div className="ticket-actions">
            <button className="action-btn">
                <Heart/>
                <span>{likes}</span>
            </button>
            <button className="action-btn">
                <MessageCircle/>
                <span>{comments}</span>
            </button>
            <button className="action-btn">
                <Share2/>
                <span>Share</span>
            </button>
        </div>
    );
}