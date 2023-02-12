import {useEffect, useState} from "react";
import {resApi} from "common/fetch";
import {useCookies} from "react-cookie";

function Item({
                  data: {
                      text,
                      type,
                      isReply,
                      isForward,
                      targetReplyId,
                      forwardDataId,
                      messageCreatedBySenderId,
                      messageSentRoomId,
                      /**
                       * {
                       * _id: 1,
                       * bio: 1,
                       * img: 1,
                       * name: 1,
                       * isActive: 1,
                       * username: 1,
                       * lastName: 1,
                       * publicLink: 1,
                       * description: 1,
                       * defaultColor: 1
                       * }
                       *  **/
                      forwardData
                  }
              }) {

    const [cookies] = useCookies(['userId']);
    const isFile = type === 'Video' || type === 'Document';
    const haveText = text && type === 'None';
    const isMyMessage = cookies.userId === messageCreatedBySenderId || cookies.userId === forwardData?._id

    return (
        <div>
            {
                haveText ? <span className="bg-gray-50">{text}</span> : <></>
            }
        </div>
    )
}

function ChatContent({
                         data: {
                             img,
                             defaultColor,
                             lastName,
                             _id,
                             name,
                             type
                         },
                         isOwner,
                         isAdmin,
                         hasMeBlockedByUser,
                         inputMessage,
                         editMessage,
                         hasClickedBlockUserByMe,
                         socket
                     }) {

    const [roomContent, setRoomContent] = useState([]);
    const [contentNotFound, setContentNotFound] = useState(false);

    const handleSavedMessageContent = async () => {
        let {data} = await resApi('personal/message');

        if (data.length === 0) {
            setContentNotFound(true);
            return;
        }

        setRoomContent(data);
    }, handleSendMessageInfoSavedMessage = async () => {
        if (inputMessage?.data) {
            await resApi('personal/message', {
                method: 'post',
                with: 'axios',
                body: inputMessage
            });
        } else
            await resApi('personal/message', {
                method: 'POST',
                body: inputMessage
            });
    };

    useEffect(() => {
        if (type === 'SA')
            handleSavedMessageContent();
        else {
            // socket
        }
    }, []);

    if (inputMessage?.type || inputMessage?.data)
        handleSendMessageInfoSavedMessage();

    return (
        <div className="flex flex-col absolute overflow-y-auto h-45 top-21 left-0 right-0 pb-3">
            {
                roomContent.map((d, i) => <Item data={d} key={i}/>)
            }
        </div>
    );

}

export default ChatContent;