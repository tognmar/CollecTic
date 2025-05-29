import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link, useNavigate, useParams} from 'react-router';
import {Film, Landmark, MapPin, MoveLeft, Music, PencilIcon, Sparkles, Trash, Trophy} from "lucide-react";
import {format} from 'date-fns';
import useFetchDelete from "../../utilities/CustomHooks/useFetchDelete.jsx";
import {deleteTicket} from "../../store/Slices/Tickets/index.js";
import '../../styles/components.css';
import {DeleteConfirmModal} from "../../sub-components/DeleteConfirmModal.jsx";
import {TicketDetailsForm} from "../TicketDetailsForm/index.jsx";
import {TicketMemoryForm} from "../TicketMemoryForm/index.jsx";

export default function TicketDetailsComp() {
    const {ticketId} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const tickets = useSelector(state => state.UserTickets.tickets);
    const ticket = tickets.find(ticket => ticket.id.toString() === ticketId);
    const user = useSelector(state => state.user.details);
    const isLoginUser = !!ticket?.user_profile?.id && !!user?.id && ticket.user_profile.id === user.id;

    // Use the custom hook with the ticket delete endpoint
    const {deleteResource, isDeleting, error, success,} = useFetchDelete(`/tickets/${ticketId}/`);

    // After successful delete, redirect to profile
    useEffect(() => {
        if (success && ticket?.user_profile?.id) {
            dispatch(deleteTicket(ticketId));
            navigate(`/profile/${ticket.user_profile.id}`); // Programmatic navigation
        }
    }, [success, navigate, ticket, dispatch, ticketId]);

    if (!ticket) return <div className="text-center text-gray-500 mt-10">Ticket not found</div>;

    return (
        <div className="max-w-xl mx-auto my-8 px-4 relative pb-20 overflow-y-auto">
            <div className=" shadow-xl rounded-2xl overflow-hidden border border-dashed">
                {/* Edit/Delete Buttons */}
                <div className="flex items-center justify-between gap-2">
                    <Link to={`/profile/${ticket?.user_profile?.id}`} className="icon-btn-back"><MoveLeft
                        className="icon-back-icon"/></Link>
                    {isLoginUser && (
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="icon-btn-delete"
                            aria-label="Delete Ticket"
                        >
                            <Trash className="icon-btn-icon"/>
                        </button>
                    )}
                </div>

                {/* Ticket Info Card */}
                <div className="ticket-frame">
                    <div className={"ticket-image"}>
                        <div className="ticket-image-inner">
                            <img src={ticket.ticket_image} alt={ticket.title} className="w-full h-full object-content"/>
                        </div>
                    </div>
                </div>


                <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-gray-800">{ticket.title_artist || 'Untitled Ticket'}</h2>
                        {isLoginUser && (
                            <button
                                onClick={() => setIsDetailsModalOpen(true)}
                                className="icon-btn-edit p-1"        /* p-1 keeps the circle small */
                                aria-label="Edit Ticket"
                            >
                                <PencilIcon className="icon-btn-icon"/>
                            </button>
                        )}
                    </div>
                    <div className="flex justify-between items-center gap-2 text-sm text-gray-500 whitespace-nowrap">
                        <div>{format(new Date(ticket.date), 'dd MMM yyyy')}</div>

                        {ticket.location && (
                            <div className="flex items-center gap-1 text-gray-600">
                                <MapPin className="w-4 h-4 text-rose-500"/>
                                <span style={{wordBreak: 'break-word'}}>{ticket.location}</span>
                            </div>
                        )}
                    </div>

                    {ticket.venue && (
                        <div className="text-sm text-gray-600">
                            <span className="font-medium">Venue:</span> {ticket.venue}
                        </div>
                    )}

                    {ticket.category && (
                        <div className="text-sm text-gray-600 flex items-center gap-1">

                            <span className="font-medium">Category:</span>{" "}

                            {ticket.category === 'music' && <Music className="w-4 h-4 text-gray-500"/>}
                            {ticket.category === 'sports' && <Trophy className="w-4 h-4 text-gray-500"/>}
                            {ticket.category === 'shows' && <Film className="w-4 h-4 text-gray-500"/>}
                            {ticket.category === 'attractions' && <Landmark className="w-4 h-4 text-gray-500"/>}

                            {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}
                        </div>
                    )}

                    {(ticket.text || ticket.event_image) && (
                        <>
                            <div className="memory-heading pt-5">
                                <Sparkles className="memory-icon"/>
                                <span>Memories</span>
                            </div>
                        </>
                    )}

                    <p className="ticket-description-memory">
                        {ticket.text || ''}
                    </p>

                    {ticket.tags?.length > 0 && (
                        <div className="flex gap-2 flex-wrap mt-4">
                            {ticket.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-xs font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {ticket.event_image && (
                        <div className="mt-8">
                            <img
                                src={ticket.event_image}
                                alt="Event Memory"
                                className="event-memory-image"
                            />
                        </div>
                    )}

                </div>

                {isLoginUser && (
                    <div className="flex justify-center">
                        <button
                            onClick={() => setIsMemoryModalOpen(true /* or a dedicated setMemoryOpen */)}
                            className="btn-memory mb-5"
                        >
                            Add/ Update Memories
                        </button>
                    </div>)}
            </div>

            {/* Modal for Edit details */}
            {isDetailsModalOpen && (
                <div className="modal-overlay">
                    <div
                        className="modal-dialog">
                        <TicketDetailsForm ticketId={ticket.id} onClose={() => setIsDetailsModalOpen(false)}/>
                    </div>
                </div>
            )}

            {/* Modal for Add/Edit memories */}
            {isMemoryModalOpen && (
                <div className="modal-overlay">
                    <div
                        className="modal-dialog">
                        <TicketMemoryForm ticketId={ticket.id} onClose={() => setIsMemoryModalOpen(false)}/>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            {showConfirm && (
                <DeleteConfirmModal
                    isOpen={showConfirm}
                    onCancel={() => setShowConfirm(false)}
                    onConfirm={deleteResource}
                    isDeleting={isDeleting}
                    error={error}
                />
            )}


        </div>
    );
}
