import HomeNavbar from "pages/home/HomeNavbar";
import ListOfChatWithTabView from "pages/home/ListOfChatWithTabView";
import ChatNavbar from "pages/home/ChatNavbar";
import ChatContent from "pages/home/ChatContent";
import {Navigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import {useState} from "react";
import NotFound from "component/NotFound";
import {resApi} from "common/fetch";
import {dataComposition} from "util/Utils";

function HomeActivity() {

    const [cookies] = useCookies(['apiKey']);
    const [dataSearched, setDataSearched] = useState([]);
    const [haveDataSearched, setHaveDataSearched] = useState(false);
    const [tabViewItemClickedData, setTabViewItemClickedData] = useState({});

    const handleTabViewItemClickedData = d => setTabViewItemClickedData(d),
        handleTextSearched = async d => {
            if (!d) {
                setDataSearched([]);
                return;
            }
            let data = await resApi(`common/search`, {query: {v: d}});

            setHaveDataSearched(data?.statusCode === 404);

            if (data?.statusCode === 200)
                setDataSearched(dataComposition(data.data));
        },
        handleNavbarBackButton = () => setTabViewItemClickedData({});

    return (
        <div className="flex flex-col">
            {
                cookies?.apiKey ? <></> : <Navigate to="/user/login"/>
            }

            {/* Navbar */}
            <HomeNavbar
                getTextSearched={handleTextSearched}/>

            {/* Body */}
            <div className="flex mt-3">

                {/* List Of Channel, Group, E2E Or Saved Message */}
                <ListOfChatWithTabView
                    dataSearched={dataSearched}
                    haveDataSearched={haveDataSearched}
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