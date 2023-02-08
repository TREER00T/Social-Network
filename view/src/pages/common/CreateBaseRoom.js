import UploadFile from 'img/upload.svg';
import BackIcon from 'img/arrow-left.svg';
import EditText from "component/EditText";
import {useState} from "react";
import {Navigate} from "react-router-dom";
import Button from "component/Button";
import ImageButton from "component/ImageButton";
import {resApi} from "common/fetch";

export default function CreateBaseRoom({type}) {
    const [avatarFile, setAvatarFile] = useState();
    const [avatar, setAvatar] = useState('');
    const [roomName, setRoomName] = useState('');
    const [hasClickedButton, setHasClickedButton] = useState(false);
    const [hasClickedBackButton, setHasClickedBackButton] = useState(false);

    const handleBackButton = () => setHasClickedBackButton(!hasClickedBackButton),
        handleRoomName = d => setRoomName(d),
        handleChangeImage = e => {
            if (e.target.files.length > 0) {
                setAvatarFile(e.target.files[0]);
                setAvatar(URL.createObjectURL(e.target.files[0]));
            }
        }, requestHandler = async () => {
            await resApi(`${type}`, {
                method: 'post',
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                body: [
                    ...(avatar ? [{
                        value: avatarFile,
                        key: 'avatar'
                    }] : []), {
                        value: roomName,
                        key: 'name'
                    }],
                with: 'axios'
            });
        }, handleButtonOnClick = async () => {
            setHasClickedButton(true)
            await requestHandler();
        };

    return (
        <div className="flex flex-col">
            <ImageButton src={BackIcon} className="m-5" onClick={handleBackButton}/>
            <div className="flex flex-col mt-24 items-center">
                <div className="w-32 h-32 mx-auto my-auto">
                    <label htmlFor="upload-avatar" className="hover:cursor-pointer">
                        {
                            avatar ?
                                <div className="w-36 h-36">
                                    <img src={avatar} alt="Avatar"
                                         className="rounded-full border-2 border-blue-200/100 w-36 h-36"/>
                                </div> :
                                <div
                                    className="flex items-center justify-center rounded-full bg-gray-80 w-36 h-36 shadow-xl">
                                    <img className="w-12 h-12" src={UploadFile} alt="Icon"/>
                                </div>
                        }
                    </label>
                    <input className="w-0" type="file" id="upload-avatar"
                           onChange={handleChangeImage}/>
                </div>
                <EditText label="Name" className="mt-20" getText={handleRoomName}/>
                <Button className="mt-10"
                        disabled={!roomName}
                        onClick={handleButtonOnClick}>Create</Button>
                {
                    hasClickedButton || hasClickedBackButton ? <Navigate to="/home"/> : <></>
                }
            </div>
        </div>
    )
}