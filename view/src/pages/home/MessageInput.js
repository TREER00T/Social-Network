import AddFile from 'img/plus.svg';
import Close from 'img/close.svg';
import SendMessage from 'img/send-message.svg';
import {useEffect, useRef, useState} from "react";
import {getFileFormat, imageFormats, videoFormats} from "util/Utils";
import Button from "component/Button";

export default function MessageInput({
                                         getMessage,
                                         hasClickedBlockUserByMe,
                                         hasMeBlockedByUser,
                                         type,
                                         isAdmin,
                                         isOwner,
                                         replyDataView,
                                         hasClickedReply,
                                         editMessage,
                                         hasJoinedInRoom,
                                         handleDismissReply,
                                         setHasJoinedInRoom,
                                         handleUnBlockUser
                                     }) {

    const inputRef = useRef(null);
    const [file, setFile] = useState({});
    const [text, setText] = useState('');

    const handleInput = e => {
        const {value} = e.target;
        setText(value);
    }, handleUploadFile = e => {
        let file = e.target.files;
        if (file.length > 0) {
            file = file[0];
            setFile(file);
        }
    }, handleSendMessage = e => {
        if (e.key === 'Enter' || e._reactName === 'onClick') {
            let fileT = getFileFormat(file?.name);
            let isImage = imageFormats.includes(fileT);
            let isVideo = videoFormats.includes(fileT);
            let msg = {
                type: text && !file?.name ? 'None' : isImage ? 'Image' : isVideo ? 'Video' : 'Document',
                ...(text ? {text: text} : {}),
                ...(file?.name ? {file: file} : {})
            };

            let data = [];
            if (file?.name)
                for (let key in msg)
                    data.push({key: key, value: msg[key]});

            getMessage(file?.name ? {data: data} : msg);
            setText('');
            setFile({});
        }
    };

    useEffect(() => {
        setText(editMessage?.text ? editMessage?.text : '');
    }, [editMessage]);

    return (
        <div>
            {
                hasClickedReply ?
                    <div
                        className={`bg-gray-110 rounded-full flex p-3 items-center ${hasClickedReply ? 'absolute bottom-18' : ''}`}>
                        <img src={Close} alt="Icon"
                             onClick={handleDismissReply}
                             className="w-10 h-10 p-2 hover:cursor-pointer hover:bg-gray-400 rounded-full mr-2"/>
                        <span>{replyDataView?.text ? replyDataView?.text : replyDataView.fileName}</span>
                    </div> : <></>
            }
            {(!hasMeBlockedByUser || !hasClickedBlockUserByMe) && (((type === 'Channel' || type === 'Group') && hasJoinedInRoom) ||
                ((isAdmin || isOwner) && hasJoinedInRoom) || type === 'SA') ?
                <div
                    className={`flex fixed absolute bottom-0 mb-2 mx-1 left-0 right-0 rounded-lg ${hasMeBlockedByUser || hasClickedBlockUserByMe ? 'bg-white' : 'bg-gray-110'}`}>


                    <label htmlFor="upload-file" className="mx-2 hover:cursor-pointer mt-4">
                        <img src={AddFile}
                             alt="Icon"/>
                    </label>

                    <input type="text"
                           onChange={handleInput}
                           ref={inputRef}
                           onKeyPress={handleSendMessage}
                           value={text}
                           className="block w-full py-4 text-sm text-gray-900 border rounded-lg bg-gray-110 outline-none"
                           placeholder="Type your message..."/>

                    {
                        text || file?.name ?
                            <img src={SendMessage}
                                 alt="Icon"
                                 onClick={handleSendMessage}
                                 className="mx-2 hover:cursor-pointer"/>
                            : <></>
                    }

                    <input className="hidden"
                           type="file" id="upload-file"
                           onChange={handleUploadFile}/>
                </div> :
                hasMeBlockedByUser && type === 'E2E' ?
                    <span>You are blocked by this user</span> :
                    type === 'E2E' ?
                        <div
                            className="flex fixed absolute bottom-0 mb-2 mx-1 left-0 right-0 place-content-center"
                            onClick={handleUnBlockUser}><Button>UnBLock User</Button></div> : <></>}

            {
                type === 'Group' && !hasJoinedInRoom ?
                    <div
                        onClick={() => setHasJoinedInRoom(true)}
                        className="flex fixed absolute bottom-0 mb-2 mx-1 left-0 right-0 place-content-center">
                        <Button>Join</Button>
                    </div> : <></>
            }
        </div>

    );
}