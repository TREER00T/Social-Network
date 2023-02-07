import HomeNavbar from "pages/home/HomeNavbar";
import ListOfChatWithTabView from "pages/home/ListOfChatWithTabView";
import ChatNavbar from "pages/home/ChatNavbar";
import ChatContent from "pages/home/ChatContent";
import {Navigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import {useState} from "react";
import NotFound from "component/NotFound";

function HomeActivity() {

    const [search, setSearch] = useState('');
    const [cookies] = useCookies(['apiKey']);
    const [hasSearchViewOpen, setHasSearchViewOpen] = useState('');
    const [tabViewItemClickedData, setTabViewItemClickedData] = useState({});

    const handleTabViewItemClickedData = d => setTabViewItemClickedData(d),
        handleTextSearched = d => setSearch(d),
        handleHasSearchViewOpen = d => setHasSearchViewOpen(d),
        handleNavbarBackButton = () => setTabViewItemClickedData({});

    return (
        <div className="flex flex-col">
            {
                cookies?.apiKey ? <></> : <Navigate to="/user/login"/>
            }

            {/* Navbar */}
            <HomeNavbar
                getTextSearched={handleTextSearched}
                hasSearchViewOpen={handleHasSearchViewOpen}/>

            {/* Body */}
            <div className="flex mt-3">

                {/* List Of Channel, Group, E2E Or Saved Message */}
                <ListOfChatWithTabView
                    dataSearched={search}
                    hasSearchViewOpen={hasSearchViewOpen}
                    getItemData={handleTabViewItemClickedData}/>

                {
                    /* Chat Body */
                    tabViewItemClickedData?.type ?
                        <div className="flex flex-col ml-6">

                            {/* Chat NavBar */}
                            <ChatNavbar data={tabViewItemClickedData} backButton={handleNavbarBackButton}/>

                            {/* Chat Contents */}
                            <ChatContent data={tabViewItemClickedData}/>

                        </div> : <NotFound/>
                }

            </div>

        </div>
    );

}

export default HomeActivity;