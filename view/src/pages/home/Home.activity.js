import HomeNavbar from "pages/home/HomeNavbar";
import ListOfChat from "pages/home/ListOfChat";
import ChatNavbar from "pages/home/ChatNavbar";
import ChatContent from "pages/home/ChatContent";

function HomeActivity() {

    return (
        <div className="flex flex-col">

            {/* Navbar */}
            <HomeNavbar/>

            {/* Body */}
            <div className="flex">

                {/* List Of Channel, Group, E2E Or Saved Message */}
                <ListOfChat/>

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