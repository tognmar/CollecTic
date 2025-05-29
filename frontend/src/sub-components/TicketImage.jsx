import React from 'react';
import '../styles/components.css';

export function TicketImage({src, title, Icon}) {
    return (
        <div className="ticket-frame">
            <div className="ticket-image">
                <div className="ticket-image-inner">


                    {/* image */}
                    <img src={src} alt={title} className="w-full h-full object-content"/>

                    {/* soft fade */}
                    <div className="fade-divider"/>

                    {/* notches */}
                    <div className="absolute -left-3 top-1/2 notch"/>
                    <div className="absolute -right-3 top-1/2 notch"/>

                    {/* badge half on stub */}
                    {Icon && (
                        <div className="category-icon">
                            <Icon/>
                        </div>
                    )}


                </div>
            </div>
        </div>
    );
}