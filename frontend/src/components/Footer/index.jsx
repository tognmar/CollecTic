import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router";
import useFetchGet from "../../utilities/CustomHooks/UseFetchGet.jsx";
import {useEffect, useRef, useState} from "react";
import {load_user} from "../../store/Slices/User/index.js";
import {CircleUserRound, LucideTrophy, Map, TicketPlus, Users} from "lucide-react";


export default function Footer() {
    const dispatch = useDispatch();
    const {data} = useFetchGet("auth/users/me/");
    const loggedInUser = useSelector(state => state.user.details);
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef(null);

    // Determine which tab is active based on the current pathname
    const getActiveTab = () => {
        const {pathname} = location;
        if (pathname.startsWith('/profile/')) return 'profile';
        if (pathname === '/tickets') return 'tickets';
        if (pathname === '/users') return 'users';
        if (pathname === '/map') return 'map';
        return '';
    };

    const [activeTab, setActiveTab] = useState(getActiveTab());

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(navigator.userAgent);

    // Update active tab when location changes
    useEffect(() => {
        setActiveTab(getActiveTab());
    }, [location]);

    useEffect(() => {
        if (data) {
            dispatch(load_user(data));
        }
    }, [data, dispatch]);

    // Navigation handler that also updates the active tab
    const handleNavigation = (path, tabName) => {
        navigate(path);
        setActiveTab(tabName);
    };

    const handleFileChange = e => {
        const fileInput = e.target;
        const file = fileInput.files?.[0];
        if (!file) return;

        fileInput.value = '';

        const url = URL.createObjectURL(file);

        navigate('/tickets', {
            state: {rawFile: file, fileUrl: url, from: location.pathname}
        });
    };

    return (<>
        <div className="btm-nav mx-auto md:w-1/2 bottom-0 w-full flex z-50">
            <button
                className={activeTab === 'users' ? 'active' : ''}
                onClick={() => handleNavigation("/users", 'users')}>
                <Users size={24} color="currentColor"/>
            </button>
            <button
                className={activeTab === 'map' ? 'active' : ''}
                onClick={() => handleNavigation("/map", 'map')}>
                <Map size={24} color="currentColor"/>
            </button>
            <button
                className={activeTab === 'tickets' ? 'active' : ''}
                onClick={() => fileInputRef.current?.click()}>
                <TicketPlus size={48} className="text-primary"/>
            </button>
            <button
                className={activeTab === 'scoreboard' ? 'active' : ''}
                onClick={() => handleNavigation("/scoreboard", 'scoreboard')}>
                <LucideTrophy size={24} color="currentColor"/>
            </button>
            <button
                className={activeTab === 'profile' ? 'active' : ''}
                onClick={() => handleNavigation(`/profile/${loggedInUser?.id || ''}`, 'profile')}>
                <CircleUserRound size={24} color="currentColor"/>
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

    </>);
}