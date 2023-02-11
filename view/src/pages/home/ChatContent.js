import {useEffect, useState} from "react";
import {resApi} from "common/fetch";

function ChatContent({
                         data: {
                             img,
                             defaultColor,
                             lastName,
                             _id,
                             name,
                             type,
                             activities
                         },
                         isOwner,
                         isAdmin,
                         hasMeBlockedByUser,
                         inputMessage,
                         editMessage,
                         hasClickedBlockUserByMe,
                         socket
                     }) {

    const [roomContent, setRoomContent] = useState({});
    const [contentNotFound, setContentNotFound] = useState(false);

    const handleSavedMessageContent = async () => {
        let {data} = await resApi('personal/message');

        if (data.length === 0) {
            setContentNotFound(true);
            return;
        }

        setRoomContent(data.data);
    }, handleSendMessageInfoSavedMessage = () => {

    };

    useEffect(() => {
        if (type === 'SA')
            handleSavedMessageContent();
        else {

        }
    });

    return (
        <div className="flex flex-col absolute overflow-y-auto h-45 top-21 left-0 right-0 pb-3">

        </div>
    );

}

export default ChatContent;