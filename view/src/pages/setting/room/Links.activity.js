import {Navigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import SettingSidebar from "pages/setting/room/SettingSidebar";
import {useEffect, useState} from "react";
import {resApi} from "common/fetch";
import {getRoomType, getRoomId} from "util/Utils";
import ImageButton from "component/ImageButton";
import Refresh from "img/refresh.svg";
import {Switch} from "@material-tailwind/react";
import EditText from "component/EditText";
import Button from "component/Button";
import ErrorHandler from "component/ErrorHandler";

export default function LinksActivity() {
    const roomType = getRoomType().toLowerCase();
    const [cookies] = useCookies(['apiKey']);
    const [inviteLink, setInviteLink] = useState('');
    const [publicLink, setPublicLink] = useState('');
    const [statusCode, setStatusCode] = useState(0);
    const [hasClickedPublicLinkSwitch, setHasClickedPublicLinkSwitch] = useState(false);
    const [hasClickedPublicLinkButton, setHasClickedPublicLinkButton] = useState(false);

    const response = async () => {
            let data = await resApi(`${roomType}/link`, {
                query: {
                    [roomType === 'group' ? 'groupId' : 'channelId']: getRoomId()
                }
            });
            setHasClickedPublicLinkSwitch(!data.data?.inviteLink);
            setInviteLink(data.data?.inviteLink ?? '');
            setPublicLink(data.data?.publicLink ?? '');
        }, handleRefreshInviteLink = async () => {
            let data = await resApi(`${roomType}/link/invite`, {
                method: 'PUT',
                body: {
                    [roomType === 'group' ? 'groupId' : 'channelId']: getRoomId()
                }
            });
            setInviteLink(data.data?.inviteLink);
            setPublicLink('');
        }, handlePublicLinkReq = async () => {
            let data = await resApi(`${roomType}/link/public`, {
                method: 'PUT',
                body: {
                    [roomType === 'group' ? 'groupId' : 'channelId']: getRoomId(),
                    link: publicLink.slice(1)
                }
            });

            if (data.statusCode === 409) {
                setStatusCode(409);
                setHasClickedPublicLinkButton(true);
                return;
            }

            setPublicLink(data.data?.publicLink);
            setInviteLink('');
        }, handleHasPublicLink = async () => {
            setHasClickedPublicLinkSwitch(!hasClickedPublicLinkSwitch);

            if (!hasClickedPublicLinkSwitch)
                setInviteLink('');

            if (hasClickedPublicLinkSwitch)
                await handleRefreshInviteLink();
        },
        handlePublicLink = d => setPublicLink(d),
        handlePublicLinkButton = () => setHasClickedPublicLinkButton(!hasClickedPublicLinkButton),
        handleCopyIntoClipBoardForInviteLink = () => navigator.clipboard.writeText(inviteLink);

    useEffect(() => {
        response();
    }, []);

    return (
        <div className="flex flex-col">
            {
                cookies?.apiKey ? <></> : <Navigate to="/user/login"/>
            }

            <SettingSidebar>
                <div>
                    <div className="mb-8">
                                <span
                                    className="font-bold text-blue-100 text-lg">{(hasClickedPublicLinkSwitch ? 'Public' : 'Invite') + ' Link'}</span>
                    </div>
                    {
                        !hasClickedPublicLinkSwitch ?
                            <div className="flex items-center hover:cursor-pointer"
                                 onClick={handleCopyIntoClipBoardForInviteLink}>
                                <span className="p-3 rounded-full bg-white mr-10">{inviteLink}</span>
                                <ImageButton src={Refresh} className="bg-white"
                                             onClick={handleRefreshInviteLink}/>
                            </div>
                            :
                            <div className="flex items-center">
                                <EditText label="Public Link" getText={handlePublicLink} defaultValue={publicLink}/>
                                <Button className="ml-3" disabled={!publicLink}
                                        onClick={handlePublicLinkReq}>Update</Button>
                            </div>
                    }
                </div>
                <div className="mt-5 ml-3">
                    <Switch label={`${inviteLink ? 'public' : 'invite'} link`} onClick={handleHasPublicLink}/>
                </div>

                <ErrorHandler
                    visibility={hasClickedPublicLinkButton}
                    handler={handlePublicLinkButton}
                    statusCode={statusCode}
                    errMsg="This username already exist"/>

            </SettingSidebar>
        </div>
    )
}