import {useEffect, useRef, useState, createRef, forwardRef} from "react";
import {resApi} from "common/fetch";
import DownloadIcon from 'img/download.svg';
import Reply from 'img/arrow-back-black.svg';
import {useCookies} from "react-cookie";
import {Checkbox} from "@material-tailwind/react";
import {updateObject} from "util/Utils";

function Item({
                  data: {
                      _id,
                      text,
                      type,
                      isReply,
                      fileUrl,
                      fileSize,
                      fileName,
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
                  },
                  setHasOpenContextMenu,
                  getRightClickItemData,
                  wrapperRef,
                  setXY,
                  content,
                  firstItemForDelete,
                  setListOfIdForDelete,
                  hasClickedDelete,
                  haveEmptyDeleteList
              }) {

    const isVideo = type === 'Video';
    const isFile = type === 'Document';
    const isImage = type === 'Image';
    const haveText = text && type === 'None';
    const [cookies] = useCookies(['userId']);
    const isMyMessage = cookies.userId !== messageCreatedBySenderId || cookies.userId === forwardData?._id;

    const handleContextMenu = e => {
        e.preventDefault();

        const {clientX, clientY} = e;
        setXY([clientX, clientY]);
        setHasOpenContextMenu(true);
        getRightClickItemData({
            _id,
            text,
            type,
            isReply,
            fileUrl,
            fileSize,
            fileName,
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
        });
    }, hanCheckBox = () => setListOfIdForDelete(_id);

    let replyData = content.find(o => o._id === targetReplyId);

    return (
        <div
            onContextMenu={handleContextMenu}
            className={`mx-2 items-center flex ${isMyMessage ? 'ml-auto' : ''} ${hasClickedDelete && !haveEmptyDeleteList ? 'my-1' : 'my-3'}`}
            ref={wrapperRef}>

            <div
                className={`${isImage ? `rounded-t-xl ${isMyMessage ? 'ml-auto rounded-bl-xl rounded-br bg-gray-110' : 'rounded-bl rounded-br-xl bg-blue-100 text-white'}` : ''}`}>
                {
                    isReply && targetReplyId && replyData?._id && (isImage || isFile) ?
                        <div className="p-1 bg-gray-400 rounded-lg">
                            <span>{replyData.text ? replyData.text : replyData.fileName}</span>
                        </div> : <></>
                }
                {
                    isImage ?
                        <img className="p-2 rounded-3xl pb-4 max-h-80 max-w-80" src={fileUrl} alt="Image"/> : <></>
                }
                {
                    haveText && !isImage ?
                        isReply && targetReplyId && replyData?._id ?
                            <div
                                className={`flex flex-col rounded-t-lg ${isMyMessage ? 'rounded-bl-xl rounded-br bg-gray-110' : 'rounded-bl rounded-br-xl bg-blue-100 text-white'}`}>
                                <div className="p-2 m-1 rounded-lg bg-gray-400 flex">
                                    <img src={Reply} alt="Icon" className="mr-2"/>
                                    <span>{replyData.text ? replyData.text : replyData.fileName}</span>
                                </div>
                                <span
                                    className="p-2 rounded-t-xl">{text}</span>
                            </div> :
                            haveText && !isImage ? <span
                                    className={`p-2 rounded-t-xl ${isMyMessage ? 'rounded-bl-xl rounded-br bg-gray-110' : 'rounded-bl rounded-br-xl bg-blue-100 text-white'}`}>{text}</span>
                                : <></> : <></>
                }
                {
                    isFile || isVideo ?
                        <div
                            className={`flex flex-col rounded-t-xl ${isMyMessage ? 'rounded-bl-xl rounded-br bg-gray-110' : 'rounded-bl rounded-br-xl bg-blue-100 text-white'}`}>
                            {isFile ?
                                <div className="flex">
                                    <div
                                        className={`flex flex-col rounded-full p-2 m-2 ${isMyMessage ? 'bg-black' : 'bg-white'}`}>
                                        <img className="w-8 h-8" alt="Icon" src={DownloadIcon}/>
                                    </div>
                                    <div className="flex flex-col place-content-center mr-3">
                                        <span className="font-bold">{fileName}</span>
                                        <span>{fileSize}</span>
                                    </div>
                                </div> :
                                <video
                                    controls
                                    className={`flex max-h-80 max-w-80 p-2 pb-4 rounded-t-xl ${isMyMessage ? 'rounded-bl-xl rounded-br bg-gray-110' : 'rounded-bl rounded-br-xl bg-blue-100 text-white'}`}>
                                    <source src={fileUrl} type="video/mp4"/>
                                </video>
                            }
                            {
                                text ? <span
                                    className={`p-2 rounded-t-xl ${isMyMessage ? 'rounded-bl-xl rounded-br bg-gray-110' : 'rounded-bl rounded-br-xl bg-blue-100 text-white'}`}>{text}</span> : <></>
                            }
                        </div> : <></>
                }
            </div>
            {
                hasClickedDelete && !haveEmptyDeleteList && isMyMessage ?
                    <div className="mx-2">
                        <Checkbox
                            onClick={hanCheckBox}
                            defaultChecked={firstItemForDelete && firstItemForDelete === _id}/>
                    </div> : <></>
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
                         inputMessage,
                         getHasClickedDeleteMessage,
                         setHasOpenContextMenu,
                         setHasClickedDoAction,
                         hasClickedEditMessage,
                         setListOfIdForDelete,
                         setContextMenuXY,
                         hasClickedReply,
                         setHasClickedDelete,
                         hasClickedDelete,
                         wrapperRef,
                         firstItemForDelete,
                         setRightClickData,
                         listOfIdForDelete,
                         setHasClickedReply,
                         setHasClickedEditMessage,
                         rightClickData,
                         hasAccessToDelete,
                         socket
                     }) {

    const lastMessageRef = useRef(null);
    const [roomContent, setRoomContent] = useState([]);
    const [contentNotFound, setContentNotFound] = useState(false);
    const event = (t, op) => `${t}${type === 'E2E' ? 'PV' : type}${op}Message`;

    const handleRoomMessageContent = async () => {
            let result = [];
            if (type === 'SA') {
                let {data} = await resApi('personal/message');
                if (data.length === 0) {
                    setContentNotFound(true);
                    return;
                }
                result = data;
            } else {
                // socket
            }

            setRoomContent(result);
        }, handleSendMessage = async () => {
            let id = rightClickData?._id;

            if (hasClickedEditMessage)
                delete rightClickData._id;

            if (type === 'SA')
                if (inputMessage?.data)
                    await resApi('personal/upload/file', {
                        method: 'post',
                        with: 'axios',
                        body: inputMessage.data
                    });
                else {
                    await resApi('personal/message', {
                        method: hasClickedEditMessage ? 'PUT' : 'POST',
                        body: hasClickedEditMessage ? {
                            ...updateObject(rightClickData, inputMessage),
                            messageId: id
                        } : hasClickedReply ? {
                            ...updateObject(inputMessage, {
                                isReply: true,
                                targetReplyId: id
                            })
                        } : inputMessage
                    });
                }
            else {
                socket.emit(event('on', hasClickedEditMessage ? 'Edit' : 'Send'),
                    hasClickedEditMessage ? {
                        ...updateObject(rightClickData, inputMessage),
                        messageId: id,
                        roomId: _id
                    } : hasClickedReply ? {
                        ...updateObject(inputMessage, {
                            isReply: true,
                            targetReplyId: id,
                            roomId: _id
                        })
                    } : {
                        ...inputMessage,
                        roomId: _id
                    });

                // socket.on(event('emit', hasClickedEditMessage ? 'Edit' : 'Send'), _id, d => {
                //     console.log(d)
                // });
            }

            if (hasClickedReply)
                setHasClickedReply(false);

            if (!hasClickedEditMessage)
                setRoomContent([...roomContent, inputMessage]);
            else {
                let result = roomContent.map(o => o._id === id ? updateObject(rightClickData, inputMessage) : o);
                setRoomContent([...result]);
                setHasClickedEditMessage(false);
            }
        },
        handleDeleteMultiMessage = id => {
            if (!listOfIdForDelete.includes(id)) {
                setListOfIdForDelete(arr => [...arr, id]);
                getHasClickedDeleteMessage(true);
            } else {
                if (listOfIdForDelete.length === 1) {
                    getHasClickedDeleteMessage(false);
                }
                let content = listOfIdForDelete.filter(s => s !== id);
                setListOfIdForDelete(() => [...content]);
            }
        },
        handleDeleteMessage = async () => {
            let listOfId = [...listOfIdForDelete, rightClickData?._id];
            let newContent = roomContent;
            newContent = newContent.filter(obj => !listOfId.includes(obj._id));
            setRoomContent(() => [...newContent]);
            setHasClickedDoAction();
            setHasClickedDelete(false);
            setListOfIdForDelete([]);
            getHasClickedDeleteMessage(false);
            if (type === 'SA') {
                await resApi('personal/message', {
                    method: 'DELETE',
                    body: {
                        listOfId: {
                            data: listOfId
                        }
                    }
                });
            } else {
                // socket
            }
        },
        handleRightClickData = d => setRightClickData(d),
        handleContextMenuXY = d => setContextMenuXY(d);

    useEffect(() => {
        setRoomContent([]);
        handleRoomMessageContent();
    }, [type]);

    useEffect(() => {
        if (hasAccessToDelete)
            handleDeleteMessage();

        if (inputMessage?.type || inputMessage?.data)
            handleSendMessage();
    }, [hasAccessToDelete, inputMessage]);

    useEffect(() => {
        lastMessageRef.current.scrollIntoView({behavior: 'smooth'});
    });


    return (
        <div className="flex flex-col absolute overflow-y-auto h-45 top-21 left-0 right-0">
            {
                !contentNotFound ? roomContent.map((d, i) =>
                        <Item data={d} key={i} wrapperRef={wrapperRef}
                              getRightClickItemData={handleRightClickData}
                              setXY={handleContextMenuXY}
                              firstItemForDelete={firstItemForDelete}
                              content={roomContent}
                              hasClickedDelete={hasClickedDelete}
                              setListOfIdForDelete={handleDeleteMultiMessage}
                              haveEmptyDeleteList={listOfIdForDelete.length === 0}
                              setHasOpenContextMenu={(d) => setHasOpenContextMenu(d)}/>) :
                    <span className="text-center my-auto text-lg">Not Found</span>
            }

            <div ref={lastMessageRef}/>
        </div>
    );

}

export default ChatContent;