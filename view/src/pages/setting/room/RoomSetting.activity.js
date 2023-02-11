import SettingSidebar from "pages/setting/room/SettingSidebar";
import {Navigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import {useEffect, useState} from "react";
import {resApi} from "common/fetch";
import {getRoomType, getRoomId} from "util/Utils";
import EditText from "component/EditText";
import Button from "component/Button";
import {Checkbox} from "@material-tailwind/react";


export default function RoomSettingActivity() {
    const roomType = getRoomType().toLowerCase();
    const [name, setName] = useState('');
    const [avatarFile, setAvatarFile] = useState();
    const [avatar, setAvatar] = useState('');
    const [cookies] = useCookies(['apiKey']);
    const [roomInfo, setRoomInfo] = useState({});
    const [description, setDescription] = useState('');
    const [hasRoomDelete, setHasRoomDelete] = useState(false);
    const [hasClickedCheckBoxForDeleteRoom, setHasClickedCheckBoxForDeleteRoom] = useState(false);

    const handleChangeImage = e => {
            if (e.target.files.length > 0) {
                setAvatarFile(e.target.files[0]);
                setAvatar(URL.createObjectURL(e.target.files[0]));
            }
        }, response = async () => {
            let data = await resApi(`${roomType}/info`, {
                query: {
                    [roomType === 'group' ? 'groupId' : 'channelId']: getRoomId()
                }
            });
            setRoomInfo(data.data);
            setAvatar(data.data?.img);
            setName(data.data.name);
            setDescription(data.data?.description);
        }, updateProfile = async () => {

            if (avatar && roomInfo?.img !== avatar) {
                await resApi(`${roomType}/upload/avatar`, {
                    body: [{
                        value: avatarFile,
                        key: 'avatar'
                    }, {
                        value: getRoomId(),
                        key: roomType === 'type' ? 'groupId' : 'channelId'
                    }],
                    with: 'axios'
                });
            }

            if (roomInfo?.description !== description)
                await resApi(`${roomType}/description`, {
                    method: 'PUT',
                    body: {
                        [roomType === 'group' ? 'groupId' : 'channelId']: getRoomId(),
                        description: description,
                    }
                });

            if (roomInfo.name !== name)
                await resApi(`${roomType}/name`, {
                    method: 'PUT',
                    body: {
                        [roomType === 'group' ? 'groupId' : 'channelId']: getRoomId(),
                        name: name,
                    }
                });

        }, handleDescription = d => setDescription(d),
        handleName = d => setName(d),
        handleClickedCheckBoxForDeleteRoom = () => setHasClickedCheckBoxForDeleteRoom(!hasClickedCheckBoxForDeleteRoom),
        handleDeleteRoomRequest = async () => {
            await resApi(`${roomType}`, {
                method: 'DELETE',
                body: {
                    [roomType === 'group' ? 'groupId' : 'channelId']: getRoomId()
                }
            });

            setHasRoomDelete(true);
        };

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
                    <div className="float-left mt-1">
                        <span className="text-2xl text-blue-200 font-bold">Profile</span>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={updateProfile}>Update Profile</Button>
                    </div>
                </div>

                <div className="flex mt-10 flex-col">
                    <div className="flex">
                        <EditText label="Name" defaultValue={name} getText={handleName}/>
                        <EditText label="Description" className="ml-8" getText={handleDescription}
                                  defaultValue={description}/>
                    </div>

                    <div className="flex ml-96">
                        <div className="w-32 h-32 mx-auto my-auto">
                            <label htmlFor="upload-avatar" className="hover:cursor-pointer">
                                {
                                    avatar ?
                                        <img src={avatar} alt="My Profile"
                                             className="rounded-full border-2 border-blue-200/100 w-32 h-32"/> :
                                        <div className="flex flex-col w-32 h-32 rounded-full place-content-center"
                                             onChange={handleChangeImage}
                                             style={{
                                                 color: 'white',
                                                 backgroundColor: roomInfo.defaultColor
                                             }}><span className="text-center">{name?.slice(0, 2)}</span></div>
                                }
                            </label>
                            <input className="w-0" type="file" id="upload-avatar"
                                   onChange={handleChangeImage}/>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="my-7">
                        <span className="font-bold text-2xl text-blue-100">Delete Room</span>
                    </div>
                    <span className="font-bold text-me text-gray-600 mb-3">
                        All your information will be deleted from the database and you will no longer be able to access the deleted information,
                        Do you agree with this?
                    </span>
                    <Checkbox color="blue" label="Agree" onClick={handleClickedCheckBoxForDeleteRoom}/>
                    <Button className="w-44 mt-3"
                            color="red" onClick={handleDeleteRoomRequest}
                            disabled={!hasClickedCheckBoxForDeleteRoom}>Delete Room</Button>
                </div>

                {
                    hasRoomDelete ?
                        <Navigate to="/home"/>
                        : <></>
                }
            </SettingSidebar>
        </div>
    )
}