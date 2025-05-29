import {useNavigate, useParams} from "react-router";
import {useSelector} from "react-redux";
import {useRef} from "react";

export default function NoTicketsAvailable() {
    const {userId} = useParams();
    const navigate = useNavigate()
    const loggedInUser = useSelector(state => state.user.details.id) === Number(userId)
    const fileInputRef = useRef(null);

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(navigator.userAgent);

    const handleFileChange = e => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);

        navigate('/tickets', {
            state: {rawFile: file, fileUrl: url, from: location.pathname}
        });
    };

    if (loggedInUser)
        return (
            <div className="mt-4 px-4 text-center">
                <div className="card bg-base-200 p-8">
                    <h3 className="text-lg font-bold mb-2">No Tickets Found</h3>
                    <p>Add your first concert ticket to get started!</p>
                    <button className="btn-memory mt-4 px-8 sm:px-8 md:px-16 mx-auto"
                            onClick={() => fileInputRef.current?.click()}>Add Ticket
                    </button>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={isIOS ? 'image/*,application/pdf' : 'image/*,application/pdf'}
                    capture={isAndroid ? 'environment' : undefined}
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
        )
    return (
        <div className="mt-4 px-4 text-center">
            <div className="card bg-base-200 p-8">
                <h3 className="text-lg font-bold mb-2">No Tickets Found</h3>
                <p>You haven't uploaded any tickets yet!</p>
            </div>
        </div>
    )
}