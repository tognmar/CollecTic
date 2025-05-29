import Avatar from "../../assets/SVGs/avatar.svg";
import {useLocation, useNavigate} from "react-router";
import FollowButton from "../Follow/index.jsx";
import {logout_user} from "../../store/Slices/User/index.js";
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import EditProfileModal from "../EditProfileModal/index.jsx";
import {LogOut, PencilIcon, Search, Settings} from "lucide-react";
import {load_filter, reset_filter} from "../../store/Slices/FilterProfileFetch/index.jsx";

export default function ProfileCard({userProfile, isCompact = false}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const isFansRoute = location.pathname.includes("users");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const loggedInUser = useSelector((state) => state.user.details.id) === userProfile.id;

    const handleLogout = () => {
        dispatch(logout_user());
        navigate("/sign-in");
    };

    const openEditModal = () => setIsEditModalOpen(true);
    const closeEditModal = () => setIsEditModalOpen(false);

    if (isCompact) {
        return (
            <>
                <div className="transition-all duration-300 ease-in-out bg-base-100 w-full">
                    <div
                        className={`bg-gradient-to-r from-orange-600 to-orange-400 text-primary-content shadow-md p-3 flex items-center gap-2 ${
                            isFansRoute ? "rounded-lg" : ""
                        }`}
                    >
                        <div
                            className="avatar"
                            onClick={() => {
                                navigate(`/profile/${userProfile.id}/`);
                                dispatch(reset_filter());
                            }}
                        >
                            <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                                <img
                                    src={
                                        userProfile.avatar
                                            ? `${userProfile.avatar}?${userProfile.last_updated || Date.now()}`
                                            : Avatar
                                    }
                                    alt={`${userProfile.name}'s avatar`}
                                />
                            </div>
                        </div>

                        <h2 className="text-sm font-bold">{userProfile.name}</h2>
                        {loggedInUser ? (
                            <div className="flex items-center justify-center gap-1 absolute top-4 right-2">
                                <Search
                                    className="cursor-pointer p-1 hover:text-accent"
                                    size={28}
                                    onClick={() => navigate("/search")}
                                />
                                <PencilIcon
                                    className="cursor-pointer p-1 hover:text-accent"
                                    size={28}
                                    onClick={openEditModal}
                                />
                                <LogOut
                                    className="cursor-pointer p-1 hover:text-accent"
                                    size={28}
                                    onClick={handleLogout}
                                />
                            </div>
                        ) : (
                            <div className="flex gap-2 items-end absolute right-5">
                                <FollowButton user={userProfile}/>
                            </div>
                        )}
                    </div>
                </div>

                {/* Edit Profile Modal is now managed by state, not by the checkbox */}
                {isEditModalOpen && <EditProfileModal onClose={closeEditModal}/>}
            </>
        );
    }

    return (
        <>
            <div className="w-full transition-all duration-300 ease-in-out bg-base-100">
                <div
                    className="bg-gradient-to-b from-orange-600 to-orange-400 y text-primary-content shadow-xl p-6 min-h-[66px] flex flex-col items-center relative overflow-visible">
                    {loggedInUser ? (
                        <div className="flex items-center justify-end gap-1 absolute top-2 right-2">
                            <Search
                                className="cursor-pointer p-1 hover:text-accent"
                                size={28}
                                onClick={() => navigate("/search")}
                            />
                            <Settings
                                className="cursor-pointer p-1 hover:text-accent"
                                size={28}
                                onClick={() => navigate("/settings")}
                            />
                            <LogOut
                                className="cursor-pointer p-1 hover:text-accent"
                                size={28}
                                onClick={handleLogout}
                            />
                        </div>
                    ) : (
                        <Search
                            className="cursor-pointer hover:scale-110 transition-transform flex items-center justify-end gap-1 absolute top-2 right-3"
                            size={24}
                            onClick={() => navigate("/search")}
                        />
                    )}

                    {/* Avatar with name, edit icon, and location below */}
                    <div
                        className="flex flex-col items-center absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
                        {/* Avatar */}
                        <div className="avatar mb-2">
                            <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img
                                    src={
                                        userProfile.avatar
                                            ? `${userProfile.avatar}?${userProfile.last_updated || Date.now()}`
                                            : Avatar
                                    }
                                    alt={`${userProfile.name}'s avatar`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Username and edit/follow */}
            <div className="flex flex-col items-center mt-11">
                <div className="flex items-center gap-2">
                    <h2 className="text-1xl font-bold">{userProfile.name}</h2>
                    {loggedInUser ? (
                        <div
                            onClick={openEditModal}
                            className="cursor-pointer hover:scale-110 transition-transform"
                        >
                            <PencilIcon size={16}/>
                        </div>
                    ) : (
                        <FollowButton user={userProfile}/>
                    )}
                </div>

                {/* Location */}
                {userProfile.location && (
                    <h2 className="text-sm">{userProfile.location}</h2>
                )}
            </div>


            {/* Stats Row */}
            <div className="flex justify-center items-center w-full max-w-md mx-auto text-center mt-2">


                {/* Tickets */}
                <div
                    className="flex-1 flex flex-col items-center cursor-pointer select-none hover:bg-orange-50 rounded transition py-2"
                    onClick={() => dispatch(load_filter("My Tickets"))}
                >
                    <span className="text-xl font-bold">{userProfile.ticket_count}</span>
                    <span className="text-xs uppercase tracking-wide text-gray-500">Tickets</span>
                </div>
                {/* Divider */}
                <div className="w-px h-8 bg-gray-300 mx-2"/>
                {/* Followers */}
                <div
                    className="flex-1 flex flex-col items-center cursor-pointer select-none hover:bg-orange-50 rounded transition py-2"
                    onClick={() => dispatch(load_filter("followers"))}
                >
                    <span className="text-xl font-bold">{userProfile.follower_count}</span>
                    <span className="text-xs uppercase tracking-wide text-gray-500">Followers</span>
                </div>
                {/* Divider */}
                <div className="w-px h-8 bg-gray-300 mx-2"/>
                {/* Following */}
                <div
                    className="flex-1 flex flex-col items-center cursor-pointer select-none hover:bg-orange-50 rounded transition py-2"
                    onClick={() => dispatch(load_filter("following"))}
                >
                    <span className="text-xl font-bold">{userProfile.following_count}</span>
                    <span className="text-xs uppercase tracking-wide text-gray-500">Following</span>
                </div>
            </div>


            {/* Edit Profile Modal is now managed by state, not by the checkbox */}
            {isEditModalOpen && <EditProfileModal onClose={closeEditModal}/>}

        </>
    );
}
