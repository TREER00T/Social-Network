import AddFile from 'img/plus.svg';
import SendMessage from 'img/send-message.svg';
import {useState} from "react";
import {getFileFormat, imageFormats, videoFormats} from "util/Utils";

export default function MessageInput({getMessage, editMessage}) {

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
    }, handleSendMessage = () => {
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
    };


    return (
        <div className="flex fixed absolute bottom-0 mb-2 mx-1 left-0 right-0 rounded-lg bg-gray-110">

            <label htmlFor="upload-file" className="mx-2 hover:cursor-pointer mt-4">
                <img src={AddFile}
                     alt="Icon"/>
            </label>

            <input type="text"
                   onChange={handleInput}
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
        </div>
    );
}