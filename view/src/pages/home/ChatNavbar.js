import {DropDownItem, DropdownMenu} from "component/DropdownMenu";
import useOutsideAlerter from "common/useOutsideAlerter";
import {Checkbox} from "@material-tailwind/react";
import SavedMessage from "img/saved-message.svg";
import AgreeDialog from "component/AgreeDialog";
import ImageButton from "component/ImageButton";
import GridDotsMenu from "img/grid-dots.svg";
import BackIcon from "img/arrow-left.svg";
import BlockUser from "img/hand-stop.svg";
import {useEffect, useRef, useState} from "react";
import {resApi} from "common/fetch";
import Trash from "img/trash.svg";
import Setting from "img/settings.svg";
import {Navigate} from "react-router-dom";
import UserProfile from "component/UserProfile";

function ChatNavbar({
                        socket,
                        data: {
                            img,
                            defaultColor,
                            lastName,
                            username,
                            publicLink,
                            bio,
                            description,
                            _id,
                            isActive,
                            name,
                            type,
                            activities
                        },
                        backButton
                    }) {

    const isSavedMessage = type === 'SA';
    const wrapperRef = useRef('navbar');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [openUserProfile, setOpenUserProfile] = useState(false);
    const [hasClickedSetting, setHasClickedSetting] = useState(false);
    const [hasMeBlockedByUser, setHasMeBlockedByUser] = useState(false);
    const [hasClickedCheckBox, setHasClickedCheckBox] = useState(false);
    const [hasClickedClearChat, setHasClickedClearChat] = useState(false);
    const [hasClickedBlockUser, setHasClickedBlockUser] = useState(false);
    const [hasOpenedOptionMenu, setHasOpenedOptionMenu] = useState(false);
    const [hasClickedBlockUserByMe, setHasClickedBlockUserByMe] = useState(false);

    const handleClickUserProfile = () => setOpenUserProfile(!openUserProfile),
        handleBackClick = () => backButton(),
        handleClickMenuOption = () => setHasOpenedOptionMenu(!hasOpenedOptionMenu),
        handleClickedClearChat = () => setHasClickedClearChat(!hasClickedClearChat),
        handleClickedSetting = () => setHasClickedSetting(!hasClickedSetting),
        handleClickedBlockUser = () => setHasClickedBlockUser(!hasClickedBlockUser),
        handleClickCheckBoxForClearChatUs = () => setHasClickedCheckBox(!hasClickedCheckBox),
        handleAccessToClearChat = async d => {
            if (!d)
                return;

            backButton();

            await resApi(`e2e/${_id}/${hasClickedCheckBox ? 'us' : 'me'}`, {
                method: 'DELETE'
            });
        }, handleAccessToBlockUser = async d => {
            if (!d)
                return;

            await resApi('e2e/user/block', {
                method: 'PUT',
                body: {
                    targetUserId: _id
                }
            });
        }, handleDisableOrEnableMessageForBlockedUser = async () => {
            let data = await resApi('e2e/user/block', {
                query: {
                    targetUserId: _id
                }
            });

            let mapResult = {
                210: () => setHasClickedBlockUserByMe(true),
                211: () => setHasMeBlockedByUser(true)
            };

            if (data.statusCode === 404)
                return;

            mapResult[data.statusCode]();
        }, handleResourceAccess = async () => {
            let data = await resApi(`${type.toLowerCase()}/admins/haveAccess`, {
                query: {
                    [type === 'Group' ? 'groupId' : 'channelId']: _id
                }
            });

            let mapResult = {
                805: () => setIsAdmin(true),
                806: () => setIsOwner(true),
                403: () => {
                }
            };

            mapResult[data.statusCode]();
        };

    useOutsideAlerter(wrapperRef, () => {
        setHasOpenedOptionMenu(false);
    });

    useEffect(() => {
        socket.emit('onGroupSendMessage', {
            roomId: _id,
            type: 'None',
            text: 'Hello'
        });
        socket.on('emitGroupSendMessageError', d => {
            console.log(d)
        })

        if (type === 'E2E')
            handleDisableOrEnableMessageForBlockedUser();

        if (type === 'Group' || type === 'Channel')
            handleResourceAccess();
    }, []);

    return (
        <div className="flex items-center relative w-screen max-w-4xl pb-1" style={{
            boxShadow: '0 2px 2px -2px gray'
        }} ref={wrapperRef}>

            <ImageButton src={BackIcon} onClick={handleBackClick}/>

            <UserProfile open={openUserProfile}
                         handleOpen={handleClickUserProfile}
                         info={{
                             img,
                             defaultColor,
                             lastName,
                             publicLink,
                             isActive,
                             username,
                             isOwner,
                             isAdmin,
                             activities,
                             bio,
                             description,
                             _id,
                             name,
                             type
                         }}/>


            <div
                className="flex py-1 px-2 ml-6 mr-auto justify-end hover:cursor-pointer hover:bg-gray-100 hover:rounded-lg items-center"
                onClick={handleClickUserProfile}>
                {
                    img ?
                        <img className="h-14 w-14 rounded-lg mr-3 shadow-xl" src={img} alt="User Avatar"/> :
                        <div className="flex flex-col w-14 h-14 rounded-lg place-content-center mr-3 shadow-xl" style={{
                            color: 'white',
                            backgroundColor: defaultColor
                        }}>{isSavedMessage ? <img className="h-6 rounded-full" src={SavedMessage} alt="User Avatar"/> :
                            <span className="text-center">{name.slice(0, 2)}</span>}</div>
                }
                <div className="flex py-2 flex-col">
                    <span className="my-auto text-lg font-medium text-slate-900">{name}</span>
                    {
                        type === 'E2E' ?
                            <div className="flex items-center">
                                <div
                                    className={(isActive ? "bg-green-500" : "bg-red-500") + " h-2.5 w-2.5 rounded-full mr-2"}/>
                                {
                                    isActive ? 'Online' : 'Offline'
                                }
                            </div> : <></>
                    }
                </div>
            </div>

            <ImageButton className="absolute right-0 mr-3" src={GridDotsMenu} onClick={handleClickMenuOption}
                         innerRef={wrapperRef}/>

            {
                hasOpenedOptionMenu ?
                    <DropdownMenu className="inset-y-3 right-0 mr-3">
                        <DropDownItem key="Block User" name="Block User" img={BlockUser}
                                      getHasClicked={handleClickedBlockUser}/>
                        <DropDownItem key="Clear Chat" name="Clear Chat" img={Trash}
                                      getHasClicked={handleClickedClearChat}/>
                        {
                            (type === 'Group' || type === 'Channel') && (isOwner || isAdmin) ?
                                <DropDownItem key="Setting" name="Setting" img={Setting}
                                              navigate={(<Navigate to={`/setting/${type.toLowerCase()}/${_id}`}/>)}
                                              getHasClicked={handleClickedSetting}/> : <></>
                        }
                    </DropdownMenu> : <></>
            }

            <AgreeDialog
                handler={handleClickedClearChat}
                accessToNavigate={hasClickedClearChat}
                getAccessToAction={handleAccessToClearChat}>
                <Checkbox label="Remove chat for us" onClick={handleClickCheckBoxForClearChatUs}/>
            </AgreeDialog>

            <AgreeDialog
                handler={handleClickedBlockUser}
                accessToNavigate={hasClickedBlockUser}
                getAccessToAction={handleAccessToBlockUser}
                children={`Do you want to ${hasClickedBlockUserByMe ? 'Un' : ''} Block this user?`}/>

        </div>
    );

}

export default ChatNavbar;