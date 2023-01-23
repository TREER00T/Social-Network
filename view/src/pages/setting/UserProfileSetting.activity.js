import {useCookies} from "react-cookie";
import {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import SettingSidebar from "pages/setting/SettingSidebar";
import {resApi} from "common/fetch";
import Button from "component/Button";
import EditText from "component/EditText";
import {Checkbox} from "@material-tailwind/react";
import {removeAllCookie} from "common/removeAllCookie";


export default function UserProfileSettingActivity() {
    const [cookies] = useCookies(['accessToken']);
    const [data, setData] = useState({});
    const [avatar, setAvatar] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [hasCheckBoxChecked, setHasCheckBoxChecked] = useState(false);
    const [hasClickedDeleteAccount, setHasClickedDeleteAccount] = useState(false);
    const [bio, setBio] = useState('');

    const response = async () => {
        let data = await resApi('personal/user');
        setData(data.data);
    }, updateProfile = async () => {

        if (data.img !== avatar)
            await resApi('personal/upload/avatar', {
                method: 'PUT',
                headers: {
                    'Content-type': avatar.type,
                    'content-length': avatar.length
                },
                body: {
                    avatar: avatar
                }
            });

        if (data.name !== firstName || data.lastName !== lastName)
            await resApi('personal/name', {
                method: 'PUT',
                body: {
                    firstName: firstName,
                    lastName: lastName
                }
            });

        if (data.bio !== bio)
            await resApi('personal/bio', {
                method: 'PUT',
                body: {
                    bio: bio
                }
            });

        if (data.username !== username)
            await resApi(`personal/username/${username}`, {
                method: 'PUT'
            });

    }, handleDeleteAccount = async () => {
        await resApi('personal/account', {
            method: 'DELETE'
        });
        setHasClickedDeleteAccount(!hasClickedDeleteAccount);
        removeAllCookie();
    }, handleFirstName = d => {
        setFirstName(d);
    }, handleBio = d => {
        setBio(d);
    }, handleLastName = d => {
        setLastName(d);
    }, handleUsername = d => {
        setUsername(d);
    }, handleCheckBox = () => {
        setHasCheckBoxChecked(!hasCheckBoxChecked);
    }, handleChangeImage = e => {
        setAvatar(URL.createObjectURL(e.target.files[0]));
    };

    useEffect(() => {
        response();
        setUsername(data.username ?? '');
        setLastName(data.lastName ?? '');
        setFirstName(data.name ?? '');
        setBio(data.bio ?? '');
    }, [data, username, lastName, bio, firstName]);

    return (
        <div className="flex flex-col">
            {
                cookies?.accessToken ? <></> : <Navigate to="/user/login"/>
            }

            {/* Sidebar Menu */}
            <SettingSidebar data={data}>
                <div className="flex flex-col">
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
                            <EditText label="First Name" getText={handleFirstName}/>
                            <EditText className="ml-8" label="Last Name" getText={handleLastName}/>
                        </div>
                        <div className="flex">
                            <div className="w-3/5 mt-5">
                                <EditText label="Username" getText={handleUsername}/>
                                <EditText label="Bio" className="mt-5" getText={handleBio}/>
                                <EditText label="Phone Number" className="mt-5"/>
                            </div>

                            <div className="w-32 h-32 mx-auto my-auto hover:cursor-pointer">
                                <label htmlFor="upload-avatar">
                                    {
                                        avatar ?
                                            <img src={avatar} alt="My Profile"
                                                 className="rounded-full border-2 border-blue-200/100 w-32 h-32"/> :
                                            <div className="flex flex-col w-32 h-32 rounded-full place-content-center"
                                                 id="upload-avatar"
                                                 style={{
                                                     color: 'white',
                                                     backgroundColor: data.defaultColor
                                                 }}><span className="text-center">{firstName?.slice(0, 2)}</span></div>
                                    }
                                </label>
                                <input className="w-0" type="file" id="upload-avatar" onChange={handleChangeImage}/>
                            </div>
                        </div>
                    </div>

                    <div className="my-7">
                        <span className="font-bold text-2xl text-blue-100">Delete Account</span>
                    </div>
                    <span className="font-bold text-me text-gray-600 mb-3">
                        All your information will be deleted from the database and you will no longer be able to access the deleted information,
                        Do you agree with this?
                    </span>
                    <Checkbox color="blue" label="Agree" onClick={handleCheckBox}/>
                    {
                        hasCheckBoxChecked ?
                            <Button className="w-44 mt-3" color="red" onClick={handleDeleteAccount}>Delete
                                Account</Button> :
                            <Button className="w-44 mt-3" disabled color="red">Delete Account</Button>
                    }
                    {
                        hasClickedDeleteAccount ? <Navigate to="/"/> : <></>
                    }
                </div>
            </SettingSidebar>

        </div>
    )
}