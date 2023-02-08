import Channel from 'img/channel.svg';
import Group from 'img/group.svg';
import SavedMessage from 'img/saved-message.svg';
import {Navigate} from "react-router-dom";
import {DropdownMenu} from "component/DropdownMenu";
import {resApi} from "common/fetch";
import {useEffect, useState} from "react";

function HomeNavbarDropDownMenu({className}) {

    const [hasExistSavedMessage, setHasExistSavedMessage] = useState(false);

    const handleCreateSavedMessage = async () => {
        await resApi('personal/savedMessage', {
            method: 'POST'
        });
    }, handleExistSavedMessage = async () => {
        let data = await resApi('personal/savedMessage/exist');

        setHasExistSavedMessage(data?.statusCode === 200);
    };

    useEffect(() => {
        handleExistSavedMessage()
    });

    return (
        <DropdownMenu className={className}>
            {
                [
                    {name: 'Group', img: Group, navigate: (<Navigate to="/home/create/group"/>)},
                    {name: 'Channel', img: Channel, navigate: (<Navigate to="/home/create/channel"/>)},
                    ...(hasExistSavedMessage ? [] : [{
                        name: 'Saved Message',
                        img: SavedMessage,
                        sendReq: () => handleCreateSavedMessage
                    }])
                ]
            }
        </DropdownMenu>
    );
}

export default HomeNavbarDropDownMenu;