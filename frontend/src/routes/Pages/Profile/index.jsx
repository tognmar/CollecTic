import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router";

import ProfileComp from "../../../components/ProfileComp";
import MyTickets from "../../../components/MyTickets";
import OtherUsersComp from "../../../components/OtherUsersComp";
import {load_tickets} from "../../../store/Slices/Tickets";
import useFetchGet from "../../../utilities/CustomHooks/UseFetchGet";

export default function Profile() {
    const {userId} = useParams();
    const dispatch = useDispatch();
    const activeFetch = useSelector((s) => s.filter.filter);

    const {data, error, isFetching} = useFetchGet(
        `tickets/users/${userId}/`
    );

    // 3) Sync into Redux
    useEffect(() => {
        if (data) dispatch(load_tickets(data));
    }, [data, dispatch]);

    // constants (header is 5rem tall, footer 5vh)
    const HEADER_HEIGHT_REM = 5;
    const HEADER_HEIGHT_PX = HEADER_HEIGHT_REM * 16; // 1rem = 16px
    const FOOTER_HEIGHT_VH = 3;

    return (
        <div className="min-h-screen pb-[5vh] relative">
            <header
                className={`
          sticky top-0 z-50
          bg-base-100
          shadow
        `}
            >
                <ProfileComp isCompact={false}/>
            </header>


            <main
                className="overflow-auto"
            >
                {activeFetch === "My Tickets" && (
                    <MyTickets
                        headerHeight={HEADER_HEIGHT_PX}
                        footerHeight={`${FOOTER_HEIGHT_VH}vh`}
                        error={error}
                        isFetching={isFetching}
                    />
                )}

                {(activeFetch === "following" ||
                    activeFetch === "followers") && (
                    <OtherUsersComp
                        url={activeFetch}
                        userIdPass={userId}
                    />
                )}
            </main>
        </div>
    );
}