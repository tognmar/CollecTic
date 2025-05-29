import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {X} from 'lucide-react';

import useFetchPatch from "../../utilities/CustomHooks/UseFetchPatch.jsx";
import {update_ticket} from "../../store/Slices/Tickets/index.js";
import {resizeImage} from "../../utilities/ImageProccess/resizeImage.jsx";
import {validateImage} from '../../utilities/ImageProccess/validateImage.jsx';

import '../../styles/components.css';

export function TicketMemoryForm({ticketId, onClose}) {
    const ticket = useSelector(s =>
        s.UserTickets.tickets.find(t => t.id === ticketId)
    );
    const dispatch = useDispatch();
    const {patchData, errorPatch, isPatchFetching, dataPatch} = useFetchPatch();

    const initial = useMemo(() => ({
        text: ticket?.text ?? '',
        event_image: null,
    }), [ticket]);

    const [data, setData] = useState(initial);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [preview, setPreview] = useState(ticket?.event_image || null);

    // revoke the blob URL when the component unmounts or the file changes
    useEffect(() => {
        return () => preview && preview.startsWith('blob:') && URL.revokeObjectURL(preview);
    }, [preview]);

    useEffect(() => {
        if (dataPatch) {
            setSuccess('Ticket updated successfully!');
            setError('');
            dispatch(update_ticket(dataPatch));
            if (onClose) {
                onClose();
            }
        }

        if (errorPatch) {
            setError(errorPatch);
            setSuccess('');
        }
    }, [dataPatch, errorPatch]);

    const onChange = useCallback(e => {
        const {name, value} = e.target;
        if (name === 'text' && value.length > 250) return;
        setData(d => ({...d, [name]: value}));
    }, []);

    const onFile = useCallback(async e => {
        const file = e.target.files?.[0];
        if (!file) return;

        const err = validateImage(file);
        if (err) return setError(err);

        try {
            const resized = await resizeImage(file, 1024, 1024);
            setData(d => ({...d, event_image: resized}));
            setPreview(URL.createObjectURL(resized));
            setError('');
        } catch {
            setError('Failed to resize image');
        }
    }, []);

    const save = useCallback(async () => {
        try {
            const body = new FormData();
            Object.entries(data).forEach(([k, v]) => {
                 // If value is null or undefined, skip it; otherwise append (even empty string)
                 if (v !== undefined && v !== null) {
                    body.append(k, v);
                 }
            });

            const updated = await patchData('tickets', ticketId, body); // same endpoint; adjust if using /memories
            dispatch(update_ticket(updated));

            setSuccess('Memory updated');
            setError('');
            onClose?.();
        } catch (err) {
            setError(err.message || 'Update failed');
            setSuccess('');
        }
    }, [data, ticketId]);

    if (!ticket) return null;

    return (
        <form className="ticket-form">
            <h2 className="modal-header">Add / Edit Memories</h2>
            {onClose && (
                <button type="button" onClick={onClose} className="absolute top-3 right-3 icon-btn-delete">
                    <X className="icon-btn-icon"/>
                </button>
            )}

            <div className="space-y-4">
                <label className="label">
                    <span className="form-label">Set the scene in words…</span>
                </label>
                <textarea
                    name="text"
                    value={data.text}
                    onChange={onChange}
                    placeholder="Description"
                    className="ticket-form-input"
                />
                <div className="ticket-form-counter">{data.text.length}/250</div>

                {preview && (
                    <div className="w-full">
                        <label className="label">
                            <span className="form-label">Current snapshot</span>
                        </label>
                        <img
                            src={preview}
                            alt="Event preview"
                            className="event-memory-image mb-4 mt-2"
                        />
                    </div>
                )}

                <label className="label">
                    <span className="form-label">Add / Update the snapshot that says it all</span>
                </label>

                <input type="file" accept="image/*" onChange={onFile}
                       className="file-input file-input-primary border-none w-full"/>
                <p className="text-xs text-base-content/70">JPEG/PNG ≤ 20&nbsp;MB</p>
            </div>

            {error && <p className="modal-error text-center">{error}</p>}
            {success && <p className="text-success font-medium text-center">{success}</p>}

            <div className="modal-actions mt-4">
                <button type="button" onClick={save} className="btn-save" disabled={isPatchFetching}>
                    {isPatchFetching ? 'Saving…' : 'Save'}
                </button>
            </div>
        </form>
    );
}