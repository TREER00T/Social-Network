import {PersonalSettingSidebarItems} from "extra/PersonalSetting";
import SettingItem from "component/SettingItem";
import {resApi} from "common/fetch";
import {useEffect, useState} from "react";

export default function SettingSidebar({children}) {
    const [userInfo, setUserInfo] = useState({});

    const response = async () => {
        let data = await resApi('personal/user');
        setUserInfo(data.data);
    };

    useEffect(() => {
        response();
    }, []);

    return (
        <div className="flex flex-wrap bg-gray-80">

            {/* Sidebar Menu */}
            <div className="w-3/12 bg-white rounded p-3 shadow-xl h-screen sticky top-0">
                <div className="flex items-center space-x-4 p-2 mb-5">
                    {userInfo?.img ?
                        <img className="h-12 h-12 rounded-full shadow-lg" src={userInfo?.img} alt="My Avatar"/> :
                        <div className="flex flex-col w-12 h-12 rounded-full" style={{
                            color: 'white',
                            backgroundColor: userInfo?.defaultColor
                        }}><span className="text-center mt-2">{userInfo?.name?.slice(0, 2)}</span>
                        </div>
                    }
                    <div className="flex flex-col ml-3 place-content-center">
                        <h4 className="font-semibold text-lg text-gray-700 capitalize font-poppins tracking-wide">{userInfo?.name} {userInfo?.lastName}</h4>
                        <span className="text-sm tracking-wide flex items-center space-x-1 text-gray-600">Your personal account</span>
                    </div>
                </div>
                <ul className="space-y-2 text-sm">
                    {
                        PersonalSettingSidebarItems.map((o, i) => <SettingItem key={i} data={o}/>)
                    }
                </ul>
            </div>

            {/* Menu Item Body */}
            <div className="w-9/12 p-4">
                {
                    children
                }
            </div>
        </div>
    )
}