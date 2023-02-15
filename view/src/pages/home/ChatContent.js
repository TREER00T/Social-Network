import {useEffect, useRef, useState} from "react";
import {resApi} from "common/fetch";
import DownloadIcon from 'img/download.svg'
import {useCookies} from "react-cookie";
import useOutsideAlerter from "common/useOutsideAlerter";
import Edit from "img/pencil.svg";
import Trash from "img/trash.svg";
import Reply from "img/arrow-back.svg";
import {DropDownItem, DropdownMenu} from "component/DropdownMenu";
import {Checkbox} from "@material-tailwind/react";

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

    return (
        <div
            onContextMenu={handleContextMenu}
            className={`mx-2 items-center flex ${isMyMessage ? 'ml-auto' : ''} ${hasClickedDelete && !haveEmptyDeleteList ? 'my-1' : 'my-3'}`}
            ref={wrapperRef}>
            <div
                className={`${isImage ? `rounded-t-xl ${isMyMessage ? 'ml-auto rounded-bl-xl rounded-br bg-gray-110' : 'rounded-bl rounded-br-xl bg-blue-100 text-white'}` : ''}`}>
                {
                    isImage ?
                        <img className="p-2 rounded-3xl pb-4 max-h-80 max-w-80" src={fileUrl} alt="Image"/> : <></>
                }
                {
                    haveText && !isImage ? <span
                        className={`p-2 rounded-t-xl ${isMyMessage ? 'rounded-bl-xl rounded-br bg-gray-110' : 'rounded-bl rounded-br-xl bg-blue-100 text-white'}`}>{text}</span> : <></>
                }
                {
                    isFile || isVideo ?
                        <div
                            className={`flex rounded-t-xl ${isMyMessage ? 'rounded-bl-xl rounded-br bg-gray-110' : 'rounded-bl rounded-br-xl bg-blue-100 text-white'}`}>
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
                                haveText ? <span
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
                         editMessage,
                         getHasClickedDeleteMessage,
                         hasAccessToDelete,
                         socket
                     }) {

    const lastMessageRef = useRef(null);
    const wrapperRef = useRef('contextMenu');
    const [roomContent, setRoomContent] = useState([]);
    const [contextMenuXY, setContextMenuXY] = useState([]);
    const [rightClickData, setRightClickData] = useState({});
    const [hasClickedDelete, setHasClickDelete] = useState(false);
    const [contentNotFound, setContentNotFound] = useState(false);
    const [listOfIdForDelete, setListOfIdForDelete] = useState([]);
    const [firstItemForDelete, setFirstItemForDelete] = useState('');
    const [hasOpenContextMenu, setHasOpenContextMenu] = useState(false);


    useOutsideAlerter(wrapperRef, () => {
        setHasOpenContextMenu(false);
    });

    const handleSavedMessageContent = async () => {
            let {data} = await resApi('personal/message');

            if (data.length === 0) {
                setContentNotFound(true);
                return;
            }

            setRoomContent(data);
        }, handleSendMessageIntoSavedMessage = async () => {
            if (inputMessage?.data) {
                await resApi('personal/upload/file', {
                    method: 'post',
                    with: 'axios',
                    body: inputMessage.data
                });
            } else
                await resApi('personal/message', {
                    method: 'POST',
                    body: inputMessage
                });

            setRoomContent([...roomContent, inputMessage]);
        }, handleDeleteMultiMessage = id => {
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
            for (let i = 0; i < newContent.length; i++) {
                for (let j = 0; j < listOfId.length; j++) {
                    if (newContent[j]._id === listOfId[j]) {
                        delete newContent[i];
                    }
                }
            }
            setRoomContent(() => [...newContent]);
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
        handleClickDeleteMessageInDropDownItemMenu = async () => {
            if (!listOfIdForDelete.includes(rightClickData._id)) {
                setHasClickDelete(true);
                getHasClickedDeleteMessage(true);
                setHasOpenContextMenu(false);
                setFirstItemForDelete(rightClickData?._id);
                setListOfIdForDelete(arr => [...arr, rightClickData?._id]);
            } else {
                setHasClickDelete(false);
                getHasClickedDeleteMessage(false);
                let content = listOfIdForDelete.filter(s => s !== rightClickData._id);
                setListOfIdForDelete(() => [...content]);
                setFirstItemForDelete('');
            }
        },
        handleRightClickData = d => setRightClickData(d),
        handleContextMenuXY = d => setContextMenuXY(d);

    useEffect(() => {
        if (type === 'SA')
            handleSavedMessageContent();
        else {
            // socket
        }
    }, []);

    useEffect(() => {
        if (hasAccessToDelete)
            handleDeleteMessage();
    }, [hasAccessToDelete])


    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({behavior: 'smooth'});

        if (inputMessage?.type || inputMessage?.data)
            handleSendMessageIntoSavedMessage();
    }, [inputMessage]);


    return (
        <div className="flex flex-col absolute overflow-y-auto h-45 top-21 left-0 right-0" ref={wrapperRef}>
            {
                !contentNotFound ? roomContent.map((d, i) =>
                        <Item data={d} key={i} wrapperRef={wrapperRef}
                              getRightClickItemData={handleRightClickData}
                              setXY={handleContextMenuXY}
                              firstItemForDelete={firstItemForDelete}
                              hasClickedDelete={hasClickedDelete}
                              setListOfIdForDelete={handleDeleteMultiMessage}
                              haveEmptyDeleteList={listOfIdForDelete.length === 0}
                              setHasOpenContextMenu={(d) => setHasOpenContextMenu(d)}/>) :
                    <span className="text-center my-auto text-lg">Not Found</span>
            }
            {
                hasOpenContextMenu ?
                    <DropdownMenu wrapperRef={wrapperRef} style={{
                        left: (contextMenuXY[0] / 2) + 50,
                        top: contextMenuXY[1] - 200
                    }} className="right-0 mr-3">
                        <DropDownItem key="Edit" name="Edit" img={Edit}/>
                        <DropDownItem key="Delete" name="Delete" img={Trash}
                                      sendReq={handleClickDeleteMessageInDropDownItemMenu}/>
                        <DropDownItem key="Reply" name="Reply" img={Reply}/>
                    </DropdownMenu> : <></>
            }
        </div>
    );

}

export default ChatContent;