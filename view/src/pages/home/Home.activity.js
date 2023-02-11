import HomeNavbar from "pages/home/HomeNavbar";
import ListOfChatWithTabView from "pages/home/ListOfChatWithTabView";
import ChatNavbar from "pages/home/ChatNavbar";
import ChatContent from "pages/home/ChatContent";
import {Navigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import {useState} from "react";
import NotFound from "component/NotFound";
import {resApi} from "common/fetch";
import Io from "common/io";
import {dataComposition} from "util/Utils";
import MessageInput from "pages/home/MessageInput";

function HomeActivity() {

    const [socket, setSocket] = useState();
    const [cookies] = useCookies(['apiKey']);
    const [isOwner, setIsOwner] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [editMessage, setEditMessage] = useState({});
    const [inputMessage, setInputMessage] = useState({});
    const [dataSearched, setDataSearched] = useState([]);
    const [haveDataSearched, setHaveDataSearched] = useState(false);
    const [hasMeBlockedByUser, setHasMeBlockedByUser] = useState(false);
    const [hasClickedBlockUser, setHasClickedBlockUser] = useState(false);
    const [tabViewItemClickedData, setTabViewItemClickedData] = useState({});
    const [hasClickedBlockUserByMe, setHasClickedBlockUserByMe] = useState(false);

    const handleClickedBlockUser = () => setHasClickedBlockUser(!hasClickedBlockUser),
        handleInputMessage = d => setInputMessage(d),
        handleDisableOrEnableMessageForBlockedUser = async id => {
            let data = await resApi('e2e/user/block', {
                query: {
                    targetUserId: id
                }
            });

            let mapResult = {
                210: () => {
                    setHasClickedBlockUserByMe(true);
                    setHasClickedBlockUser(true);
                },
                211: () => setHasMeBlockedByUser(true)
            };

            if (data.statusCode === 404)
                return;

            mapResult[data.statusCode]();
        }, handleResourceAccess = async (type, id) => {
            let data = await resApi(`${type.toLowerCase()}/admins/haveAccess`, {
                query: {
                    [type === 'Group' ? 'groupId' : 'channelId']: id
                }
            });

            let mapResult = {
                805: () => setIsAdmin(true),
                806: () => setIsOwner(true),
                403: () => {
                }
            };

            mapResult[data.statusCode]();
        }, handleTabViewItemClickedData = async d => {
            setTabViewItemClickedData(d);
            let roomType = d.type.toLowerCase();

            if (roomType !== 'sa') {
                let socketRoom = new Io(roomType);
                setSocket(socketRoom.socket);
            }

            if (d.type === 'E2E')
                await handleDisableOrEnableMessageForBlockedUser(d._id);

            if (d.type === 'Group' || d.type === 'Channel')
                await handleResourceAccess(d.type, d._id);

        }, handleTextSearched = async d => {
            if (!d) {
                setDataSearched([]);
                return;
            }
            let data = await resApi(`common/search`, {query: {v: d}});

            setHaveDataSearched(data?.statusCode === 404);

            if (data?.statusCode === 200)
                setDataSearched(dataComposition(data.data));
        },
        handleEditMessage = d => setEditMessage(d),
        handleNavbarBackButton = () => setTabViewItemClickedData({});

    return (
        <div className="flex flex-col h-screen">
            {
                cookies?.apiKey ? <></> : <Navigate to="/user/login"/>
            }

            {/* Navbar */}
            <HomeNavbar
                getTextSearched={handleTextSearched}/>

            {/* Body */}
            <div className="flex mt-3 h-full">

                {/* List Of Channel, Group, E2E Or Saved Message */}
                <ListOfChatWithTabView
                    dataSearched={dataSearched}
                    haveDataSearched={haveDataSearched}
                    getItemData={handleTabViewItemClickedData}/>

                {
                    /* Chat Body */
                    tabViewItemClickedData?.type ?
                        <div className="flex flex-col ml-6 relative">

                            {/* Chat NavBar */}
                            <ChatNavbar socket={socket}
                                        isAdmin={isAdmin}
                                        isOwner={isOwner}
                                        handleClickedBlockUser={handleClickedBlockUser}
                                        hasClickedBlockUser={hasClickedBlockUser}
                                        hasClickedBlockUserByMe={hasClickedBlockUserByMe}
                                        data={tabViewItemClickedData}
                                        backButton={handleNavbarBackButton}/>

                            {/* Chat Contents */}
                            <ChatContent socket={socket}
                                         isAdmin={isAdmin}
                                         isOwner={isOwner}
                                         editMessage={handleEditMessage}
                                         inputMessage={inputMessage}
                                         hasClickedBlockUser={hasClickedBlockUser}
                                         hasClickedBlockUserByMe={hasClickedBlockUserByMe}
                                         hasMeBlockedByUser={hasMeBlockedByUser}
                                         data={tabViewItemClickedData}/>

                            <MessageInput getMessage={handleInputMessage} editMessage={editMessage}/>
                        </div> : <NotFound/>
                }

            </div>

        </div>
    );

}

export default HomeActivity;