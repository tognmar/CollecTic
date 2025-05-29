
import OtherUsersComp from "../../../components/OtherUsersComp/index.jsx";

export default function OtherUsers() {
    return (
        <>
            <div className="bg-gradient-to-b from-orange-600 to-orange-400 p-6 shadow-md text-center mb-4">
                <h2 className="text-2xl font-bold mb-2 text-center text-white">
                   Members
                </h2>
            </div>
            <OtherUsersComp url="users" />
        </>
    );
}