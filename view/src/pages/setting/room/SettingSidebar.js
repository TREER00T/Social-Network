import {RoomSettingSidebarItems} from "extra/RoomSetting";
import SettingItem from "component/SettingItem";
import {getRoomType} from "util/Utils";
import {useEffect, useState} from "react";
import {getRoomId} from "util/Utils";
import {resApi} from "common/fetch";


export default function SettingSidebar({children}) {
    let roomType = getRoomType();
    const [roomInfo, setRoomInfo] = useState({});

    const response = async () => {
        let data = await resApi(`${roomType}/info`, {
            query: {
                [roomType === 'Group' ? 'groupId' : 'channelId']: getRoomId()
            }
        });
        setRoomInfo(data.data);
    };

    useEffect(() => {
        response();
    }, []);


    return (
        <div className="flex flex-wrap bg-gray-80">

            {/* Sidebar Menu */}
            <div className="w-3/12 bg-white rounded p-3 shadow-xl h-screen sticky top-0">
                <div className="flex items-center space-x-4 p-2 mb-5">
                    {roomInfo?.img ?
                        <img className="h-12 w-12 rounded-full shadow-lg" src={roomInfo?.img} alt="My Avatar"/> :
                        <div className="flex flex-col w-12 h-12 rounded-full" style={{
                            color: 'white',
                            backgroundColor: roomInfo?.defaultColor
                        }}><span className="text-center mt-2">{roomInfo?.name?.slice(0, 2)}</span>
                        </div>
                    }
                    <div className="flex flex-col ml-3 place-content-center">
                        <h4 className="font-semibold text-lg text-gray-700 capitalize font-poppins tracking-wide">{roomInfo?.name}</h4>
                    </div>
                </div>
                <ul className="space-y-2 text-sm">
                    {
                        RoomSettingSidebarItems(roomType).map((o, i) => <SettingItem key={i} data={o}/>)
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