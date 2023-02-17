import HomeNavbar from "pages/home/HomeNavbar";
import ListOfChatWithTabView from "pages/home/ListOfChatWithTabView";
import ChatNavbar from "pages/home/ChatNavbar";
import ChatContent from "pages/home/ChatContent";
import {Navigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import {useEffect, useRef, useState} from "react";
import NotFound from "component/NotFound";
import {resApi} from "common/fetch";
import Io from "common/io";
import {dataComposition} from "util/Utils";
import MessageInput from "pages/home/MessageInput";
import Edit from "img/pencil.svg";
import Trash from "img/trash.svg";
import Reply from "img/arrow-back.svg";
import {DropDownItem, DropdownMenu} from "component/DropdownMenu";
import useOutsideAlerter from "common/useOutsideAlerter";

function HomeActivity() {

    const [socket, setSocket] = useState();
    const wrapperRef = useRef('contextMenu');
    const [cookies] = useCookies(['apiKey']);
    const [isOwner, setIsOwner] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [editMessage, setEditMessage] = useState({});
    const [inputMessage, setInputMessage] = useState({});
    const [dataSearched, setDataSearched] = useState([]);
    const [contextMenuXY, setContextMenuXY] = useState([]);
    const [rightClickData, setRightClickData] = useState({});
    const [hasJoinedInRoom, setHasJoinedInRoom] = useState(false);
    const [hasClickedReply, setHasClickedReply] = useState(false);
    const [listOfIdForDelete, setListOfIdForDelete] = useState([]);
    const [hasClickedDelete, setHasClickedDelete] = useState(false);
    const [haveDataSearched, setHaveDataSearched] = useState(false);
    const [firstItemForDelete, setFirstItemForDelete] = useState('');
    const [hasClickedDoAction, setHasClickedDoAction] = useState(false);
    const [hasMeBlockedByUser, setHasMeBlockedByUser] = useState(false);
    const [hasOpenContextMenu, setHasOpenContextMenu] = useState(false);
    const [hasClickedLeaveRoom, setHasClickedLeaveRoom] = useState(false);
    const [hasClickedBlockUser, setHasClickedBlockUser] = useState(false);
    const [tabViewItemClickedData, setTabViewItemClickedData] = useState({});
    const [hasClickedEditMessage, setHasClickedEditMessage] = useState(false);
    const [dataPayloadForLeaveRoom, setDataPayloadForLeaveRoom] = useState({});
    const [hasClickedDeleteMessage, setHasClickedDeleteMessage] = useState(false);
    const [hasClickedBlockUserByMe, setHasClickedBlockUserByMe] = useState(false);

    useOutsideAlerter(wrapperRef, () => {
        setHasOpenContextMenu(false);
    });

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
        }, handleHasJoinedUserInRoom = async (type, id) => {
            let data = await resApi(`${type.toLowerCase()}/users/hasJoined`, {
                query: {
                    [type === 'Group' ? 'groupId' : 'channelId']: id
                }
            });

            setHasJoinedInRoom(data.statusCode === 200);
        },
        handleJoinUserRequest = async (type, id) => {
            let data = await resApi(`${type.toLowerCase()}/users`, {
                method: 'POST',
                body: {
                    [type === 'Group' ? 'groupId' : 'channelId']: id
                }
            });

            setHasJoinedInRoom(data.statusCode === 201 || data.statusCode === 409);
        },
        handleTabViewItemClickedData = async d => {
            setTabViewItemClickedData(d);
            let roomType = d.type.toLowerCase();

            if (roomType !== 'sa') {
                let socketRoom = new Io(roomType);
                setSocket(socketRoom.socket);
            }

            if (d.type === 'E2E')
                await handleDisableOrEnableMessageForBlockedUser(d._id);

            if (d.type === 'Group' || d.type === 'Channel') {
                await handleResourceAccess(d.type, d._id);
                await handleHasJoinedUserInRoom(d.type, d._id);
            }
        },
        handleEditMessage = async () => {
            if (hasClickedEditMessage) {
                setEditMessage(rightClickData);
                setHasOpenContextMenu(false);
            }
        },
        handleClickDeleteMessageInDropDownItemMenu = async () => {
            if (!listOfIdForDelete.includes(rightClickData._id)) {
                setHasClickedDelete(true);
                setHasClickedDeleteMessage(true);
                setHasOpenContextMenu(false);
                setFirstItemForDelete(rightClickData?._id);
                setListOfIdForDelete(arr => [...arr, rightClickData?._id]);
            } else {
                setHasClickedDelete(false);
                setHasClickedDeleteMessage(false);
                let content = listOfIdForDelete.filter(s => s !== rightClickData._id);
                if (listOfIdForDelete.length === 1)
                    setHasOpenContextMenu(false);
                setListOfIdForDelete(() => [...content]);
                setFirstItemForDelete('');
            }
        },
        handleReplyMessage = () => {
            setHasClickedReply(true);
            setHasOpenContextMenu(false);
        },
        handleDismissReply = () => {
            setHasClickedReply(false);
        },
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
        handleDoAction = () => setHasClickedDoAction(!hasClickedDoAction),
        handleNavbarBackButton = () => setTabViewItemClickedData({});


    useEffect(() => {
        handleEditMessage();
    }, [hasClickedEditMessage]);

    useEffect(() => {
        if (hasJoinedInRoom)
            handleJoinUserRequest(tabViewItemClickedData.type, tabViewItemClickedData._id);
    }, [hasJoinedInRoom]);

    return (
        <div className="flex flex-col h-screen" ref={wrapperRef}>
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
                    dataPayloadForLeaveRoom={dataPayloadForLeaveRoom}
                    hasClickedLeaveRoom={hasClickedLeaveRoom}
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
                                        handleDoAction={handleDoAction}
                                        setHasClickedLeaveRoom={d => setHasClickedLeaveRoom(d)}
                                        setDataPayloadForLeaveRoom={d => setDataPayloadForLeaveRoom(d)}
                                        handleClickedBlockUser={handleClickedBlockUser}
                                        hasClickedBlockUser={hasClickedBlockUser}
                                        hasClickedDeleteMessage={hasClickedDeleteMessage}
                                        hasClickedBlockUserByMe={hasClickedBlockUserByMe}
                                        data={tabViewItemClickedData}
                                        backButton={handleNavbarBackButton}/>

                            {/* Chat Contents */}
                            <ChatContent socket={socket}
                                         isAdmin={isAdmin}
                                         isOwner={isOwner}
                                         setHasClickedEditMessage={d => setHasClickedEditMessage(d)}
                                         hasClickedEditMessage={hasClickedEditMessage}
                                         hasAccessToDelete={hasClickedDoAction}
                                         setContextMenuXY={d => setContextMenuXY(d)}
                                         setHasClickedDoAction={handleDoAction}
                                         setListOfIdForDelete={d => setListOfIdForDelete(d)}
                                         setHasOpenContextMenu={d => setHasOpenContextMenu(d)}
                                         listOfIdForDelete={listOfIdForDelete}
                                         inputMessage={inputMessage}
                                         setHasClickedDelete={setHasClickedDelete}
                                         setHasClickedReply={d => setHasClickedReply(d)}
                                         hasClickedDelete={hasClickedDelete}
                                         hasClickedReply={hasClickedReply}
                                         firstItemForDelete={firstItemForDelete}
                                         setRightClickData={d => setRightClickData(d)}
                                         rightClickData={rightClickData}
                                         getHasClickedDeleteMessage={d => setHasClickedDeleteMessage(d)}
                                         data={tabViewItemClickedData}/>

                            {
                                hasOpenContextMenu && listOfIdForDelete.length === 0 ?
                                    <DropdownMenu wrapperRef={wrapperRef} style={{
                                        left: (contextMenuXY[0] / 2) + 50,
                                        top: contextMenuXY[1] - 200
                                    }} className="right-0 mr-3">
                                        <DropDownItem key="Edit" name="Edit" img={Edit}
                                                      sendReq={() => setHasClickedEditMessage(!hasClickedEditMessage)}/>
                                        <DropDownItem key="Delete" name="Delete" img={Trash}
                                                      sendReq={handleClickDeleteMessageInDropDownItemMenu}/>
                                        <DropDownItem key="Reply" name="Reply" img={Reply}
                                                      sendReq={handleReplyMessage}/>
                                    </DropdownMenu> : <></>
                            }

                            <MessageInput
                                hasClickedBlockUserByMe={hasClickedBlockUserByMe}
                                hasMeBlockedByUser={hasMeBlockedByUser}
                                isAdmin={isAdmin}
                                isOwner={isOwner}
                                editMessage={editMessage}
                                hasClickedReply={hasClickedReply}
                                replyDataView={rightClickData}
                                handleDismissReply={handleDismissReply}
                                setHasJoinedInRoom={d => setHasJoinedInRoom(d)}
                                hasJoinedInRoom={hasJoinedInRoom}
                                getMessage={handleInputMessage}
                                type={tabViewItemClickedData?.type}
                                handleUnBlockUser={handleClickedBlockUser}/>
                        </div> : <NotFound/>
                }

            </div>

        </div>
    );

}

export default HomeActivity;