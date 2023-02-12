import {useEffect, useRef, useState} from "react";
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
    const isMyMessage = cookies.userId === messageCreatedBySenderId || cookies.userId === forwardData?._id;

    return (
        <div className="mx-2 my-3 ml-auto">
            {
                haveText ? <span
                    className={`p-2 rounded-t-xl ${isMyMessage ? 'rounded-bl-xl rounded-br bg-gray-110' : 'rounded-bl rounded-br-xl bg-blue-100 text-white'}`}>{text}</span> : <></>
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

    const lastMessageRef = useRef(null);
    const [roomContent, setRoomContent] = useState([]);
    const [contentNotFound, setContentNotFound] = useState(false);

    const handleSavedMessageContent = async () => {
        let {data} = await resApi('personal/message');

        if (data.length === 0) {
            setContentNotFound(true);
            return;
        }

        setRoomContent(data);
    }, handleSendMessageIntoSavedMessage = async () => {
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

        setRoomContent([...roomContent, inputMessage]);
    };

    useEffect(() => {
        if (type === 'SA')
            handleSavedMessageContent();
        else {
            // socket
        }
    }, []);


    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({behavior: 'smooth'});

        if (inputMessage?.type || inputMessage?.data)
            handleSendMessageIntoSavedMessage();
    }, [inputMessage]);


    return (
        <div className="flex flex-col absolute overflow-y-auto h-45 top-21 left-0 right-0 pb-3">
            {
                roomContent.map((d, i) => <Item data={d} key={i}/>)
            }
            <ChatContent/>
        </div>
    );

}

export default ChatContent;