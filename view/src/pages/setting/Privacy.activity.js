import {Navigate} from "react-router-dom";
import SettingSidebar from "pages/setting/SettingSidebar";
import {useEffect, useState} from "react";
import {resApi} from "common/fetch";
import Button from "component/Button";
import {Switch} from "@material-tailwind/react";
import EditText from "component/EditText";
import {isPassword, isEmail} from "util/Utils";
import {useCookies} from "react-cookie";

export default function PrivacyActivity() {

    const [userInfo, setUserInfo] = useState({});
    const [email, setEmail] = useState('');
    const [cookies] = useCookies(['apiKey']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [twoStepHasEnable, setTwoStepHasEnable] = useState(false);
    const isValidNewPassword = isPassword(newPassword);
    const isValidConfirmPassword = isPassword(confirmPassword);
    const isValidOldPassword = isPassword(oldPassword);
    const isValidEmail = isEmail(email);
    const isNewPasswordEqualToConfirmPassword = newPassword === confirmPassword;

    const response = async () => {
        let data = await resApi('personal/user');
        setUserInfo(data.data);
    }, handleNewPassword = d => {
        setNewPassword(d);
    }, handleOldPassword = d => {
        setOldPassword(d);
    }, handleConfirmPassword = d => {
        setConfirmPassword(d);
    }, handleEmail = d => {
        setEmail(d);
    }, handleTwoStepVerificationRequest = async () => {
        await resApi('personal/twoAuth/enable', {
            method: 'PUT',
            body: {
                email: email,
                password: newPassword
            }
        });
    }, handleRestPasswordRequest = async () => {
        await resApi('personal/twoAuth/rest/password', {
            method: 'PUT',
            body: {
                old: oldPassword,
                new: newPassword
            }
        })
    }, handleTwoStepEnable = async () => {
        setTwoStepHasEnable(!twoStepHasEnable);
        if (!twoStepHasEnable)
            await resApi('personal/twoAuth/disable', {
                method: 'PUT'
            });
    };


    useEffect(() => {
        response();
        setTwoStepHasEnable(userInfo.twoStepVerification ?? false);
    }, []);

    return (
        <div className="flex flex-col">
            {
                cookies?.apiKey ? <></> : <Navigate to="/user/login"/>
            }


            {/* Sidebar Menu */}
            <SettingSidebar userInfo={userInfo}>

                <div className="mb-8">
                    <span className="font-bold text-blue-100 text-lg">Two-Step Verification</span>
                </div>

                <span className="font-sm text-gray-600 text-me">By activating this, you can increase your security. If this issue is active, the password will be added after confirming the mobile phone number that you have chosen for your account. If you forget the password, you will not be able to access your account.</span>

                <div className="mt-10 ml-3 mb-4">
                    <Switch onClick={handleTwoStepEnable}/>
                </div>

                {
                    twoStepHasEnable ?
                        <div className="my-10">
                            <EditText label="Email" type="email" getText={handleEmail}/>
                            <EditText label="New Password" type="password" className="mt-3"
                                      getText={handleNewPassword}/>
                            <EditText label="Confirm Password" type="password" className="mt-3"
                                      getText={handleConfirmPassword}/>
                            <Button className="mt-5"
                                    disabled={!isValidEmail || !isValidNewPassword || !isValidConfirmPassword || !isNewPasswordEqualToConfirmPassword}
                                    onClick={handleTwoStepVerificationRequest}>Enable</Button>
                            <div className="my-8">
                                <span className="font-bold text-blue-100 text-lg">Change Password</span>
                            </div>

                            <EditText label="New Password" type="password" className="mt-3"
                                      getText={handleNewPassword}/>
                            <EditText label="Confirm Password" type="password" className="mt-3"
                                      getText={handleConfirmPassword}/>
                            <EditText label="Old Password" type="password" className="mt-3"
                                      getText={handleOldPassword}/>

                            {
                                isValidNewPassword && isValidConfirmPassword && isValidOldPassword && isNewPasswordEqualToConfirmPassword ?
                                    <Button className="mt-5"
                                            onClick={handleRestPasswordRequest}>Change</Button> :
                                    <Button className="mt-5" disabled>Change</Button>
                            }
                        </div> : <></>
                }

            </SettingSidebar>

        </div>
    )
}