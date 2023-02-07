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
    const [bio, setBio] = useState('');
    const [data, setData] = useState({});
    const [phone, setPhone] = useState('');
    const [avatarFile, setAvatarFile] = useState();
    const [avatar, setAvatar] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [cookies] = useCookies(['apiKey', 'accessToken']);
    const [hasCheckBoxChecked, setHasCheckBoxChecked] = useState(false);
    const [hasClickedDeleteAccount, setHasClickedDeleteAccount] = useState(false);

    const handleBio = d => setBio(d),
        handleFirstName = d => setFirstName(d),
        handleLastName = d => setLastName(d),
        handleUsername = d => setUsername(d),
        handleCheckBox = () => setHasCheckBoxChecked(!hasCheckBoxChecked),
        response = async () => {
            let data = await resApi('personal/user');
            setData(data.data);
            setAvatar(data?.data?.img);
            setUsername(data?.data?.username);
            setLastName(data?.data?.lastName);
            setFirstName(data?.data?.name);
            setPhone(data?.data?.phone);
            setBio(data?.data?.bio);
        }, updateProfile = async () => {

            if (avatar && data.img !== avatar) {
                await resApi('personal/upload/avatar', {
                    body: {
                        file: avatarFile,
                        name: 'avatar'
                    },
                    isFile: true
                });
            }

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
        }, handleChangeImage = e => {
            if (e.target.files.length > 0) {
                setAvatarFile(e.target.files[0]);
                setAvatar(URL.createObjectURL(e.target.files[0]));
            }
        };

    useEffect(() => {
        response();
    }, []);

    return (
        <div className="flex flex-col">
            {
                cookies?.apiKey ? <></> : <Navigate to="/user/login"/>
            }

            {/* Sidebar Menu */}
            <SettingSidebar userInfo={data}>
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
                            <EditText label="First Name" getText={handleFirstName} defaultValue={firstName}/>
                            <EditText className="ml-8" label="Last Name" getText={handleLastName}
                                      defaultValue={lastName}/>
                        </div>
                        <div className="flex">
                            <div className="w-3/5 mt-5">
                                <EditText label="Username" getText={handleUsername} defaultValue={username}/>
                                <EditText label="Bio" className="mt-5" getText={handleBio} defaultValue={bio}/>
                                <EditText label="Phone Number" className="mt-5" defaultValue={phone}/>
                            </div>

                            <div className="w-32 h-32 mx-auto my-auto">
                                <label htmlFor="upload-avatar" className="hover:cursor-pointer">
                                    {avatar}
                                    {
                                        avatar ?
                                            <img src={avatar} alt="My Profile"
                                                 className="rounded-full border-2 border-blue-200/100 w-32 h-32"/> :
                                            <div className="flex flex-col w-32 h-32 rounded-full place-content-center"
                                                 onChange={handleChangeImage}
                                                 style={{
                                                     color: 'white',
                                                     backgroundColor: data.defaultColor
                                                 }}><span className="text-center">{firstName?.slice(0, 2)}</span></div>
                                    }
                                </label>
                                <input className="w-0" type="file" id="upload-avatar"
                                       onChange={handleChangeImage}/>
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
                    <Button className="w-44 mt-3"
                            color="red" onClick={handleDeleteAccount}
                            disabled={!hasCheckBoxChecked}>Delete Account</Button>
                    {
                        hasClickedDeleteAccount ? <Navigate to="/"/> : <></>
                    }
                </div>
            </SettingSidebar>

        </div>
    )
}