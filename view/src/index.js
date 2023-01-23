import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {ThemeProvider} from "@material-tailwind/react";
import PhoneNumberActivity from "pages/auth/PhoneNumber.activity";
import {CookiesProvider} from 'react-cookie';
import NotFound from "./pages/NotFound";
import VerifyPasswordActivity from "pages/auth/verify/VerifyPassword.activity";
import MainActivity from "pages/main/Main.activity";
import HomeActivity from "pages/home/Home.activity";
import VerifyOTPCodeActivity from "pages/auth/verify/VerifyOTPCode.activity";
import CreateSavedMessageActivity from "pages/create/savedMessage/CreateSavedMessage.activity";
import CreateChannelActivity from "pages/create/channel/CreateChannel.activity";
import CreateGroupActivity from "pages/create/group/CreateGroup.activity";
import PrivacyActivity from "pages/setting/Privacy.activity";
import DevicesActivity from "pages/setting/Devices.activity";
import UserProfileSettingActivity from "pages/setting/UserProfileSetting.activity";
import BlockedUsersActivity from "pages/setting/BlockedUsers.activity";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <CookiesProvider>
        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainActivity/>}/>
                    <Route path="user/login" element={<PhoneNumberActivity/>}/>
                    <Route path="user/login/verify/otp" element={<VerifyOTPCodeActivity/>}/>
                    <Route path="user/login/verify/password" element={<VerifyPasswordActivity/>}/>
                    <Route path="home" element={<HomeActivity/>}/>
                    <Route path="home/settings" element={<UserProfileSettingActivity/>}/>
                    <Route path="home/settings/privacy" element={<PrivacyActivity/>}/>
                    <Route path="home/settings/devices" element={<DevicesActivity/>}/>
                    <Route path="home/settings/blockedUsers" element={<BlockedUsersActivity/>}/>
                    <Route path="home/create/group" element={<CreateGroupActivity/>}/>
                    <Route path="home/create/channel" element={<CreateChannelActivity/>}/>
                    <Route path="home/create/savedMessage" element={<CreateSavedMessageActivity/>}/>
                    <Route path='*' element={<NotFound/>}/>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    </CookiesProvider>
);