import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';

import useFetchPatch from "../../utilities/CustomHooks/UseFetchPatch.jsx";
import {update_ticket} from "../../store/Slices/Tickets/index.js";

import '../../styles/components.css';
import {Field} from "../../utilities/fieldHelper.jsx";

export function TicketDetailsForm({ ticketId, onClose }) {
  const ticket = useSelector(s => s.UserTickets.tickets.find(t => t.id === ticketId));
  const dispatch = useDispatch();
  const {patchData, errorPatch, isPatchFetching, dataPatch} = useFetchPatch();

  const initial = useMemo(() => ({
    title_artist: ticket?.title_artist ?? '',
    location    : ticket?.location     ?? '',
    venue       : ticket?.venue        ?? '',
    date        : ticket?.date         ?? '',
    ticket_image: null,
  }), [ticket]);

  const [data, setData]       = useState(initial);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const onChange = useCallback(e => {
    const { name, value } = e.target;
    setData(d => ({ ...d, [name]: value }));
  }, []);

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

  /* ---------- save ---------- */
  const save = useCallback(async () => {
    try {
      const body = new FormData();
      Object.entries(data).forEach(([k, v]) => v && body.append(k, v));

      const updated = await patchData('tickets', ticketId, body);
      dispatch(update_ticket(updated));

      setSuccess('Ticket details updated');
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
      <h2 className="modal-header">Edit Ticket Details</h2>
      {onClose && (
        <button type="button" onClick={onClose} className="absolute top-3 right-3 icon-btn-delete">
          <X className="icon-btn-icon" />
        </button>
      )}

      <div className="space-y-4">
        <Field name="title_artist" placeholder="Title / Artist" value={data.title_artist} onChange={onChange} required />
        <Field name="location"     placeholder="Location"        value={data.location}     onChange={onChange} required />
        <Field name="venue"        placeholder="Venue (optional)" value={data.venue}        onChange={onChange} />
        <Field name="date" type="date" value={data.date} onChange={onChange} required />
      </div>

      {error   && <p className="modal-error text-center">{error}</p>}
      {success && <p className="text-success font-medium text-center">{success}</p>}

      <div className="modal-actions mt-4">
        <button type="button" onClick={save} className="btn-save" disabled={isPatchFetching}>
          {isPatchFetching ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}
