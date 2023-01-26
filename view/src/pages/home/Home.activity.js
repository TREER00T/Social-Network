import HomeNavbar from "pages/home/HomeNavbar";
import ListOfChat from "pages/home/ListOfChat";
import ChatNavbar from "pages/home/ChatNavbar";
import ChatContent from "pages/home/ChatContent";
import {Navigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import {useState} from "react";

function HomeActivity() {

    const [cookies] = useCookies(['accessToken']);
    const [search, setSearch] = useState('');
    const [hasSearchViewOpen, setHasSearchViewOpen] = useState('');

    const handleTextSearched = d => {
        setSearch(d);
    }, handleHasSearchViewOpen = d => {
        setHasSearchViewOpen(d);
    };

    return (
        <div className="flex flex-col">
            {/*{*/}
            {/*    cookies?.accessToken ? <></> : <Navigate to="/user/login"/>*/}
            {/*}*/}

            {/* Navbar */}
            <HomeNavbar getTextSearched={handleTextSearched} hasSearchViewOpen={handleHasSearchViewOpen}/>

            {/* Body */}
            <div className="flex mt-3">

                {/* List Of Channel, Group, E2E Or Saved Message */}
                <ListOfChat dataSearched={search} hasSearchViewOpen={hasSearchViewOpen}/>

                {/* Chat Body */}
                <div className="flex flex-col">

                    {/* Chat NavBar */}
                    <ChatNavbar/>

                    {/* Chat Contents */}
                    <ChatContent/>

                </div>

            </div>

        </div>
    );

}

export default HomeActivity;