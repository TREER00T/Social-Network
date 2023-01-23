import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {resApi} from "common/fetch";
import {Navigate} from "react-router-dom";
import SettingSidebar from "pages/setting/SettingSidebar";

function Item({data}) {
    return (
        <tr className="bg-white hover:bg-gray-50">
            <th scope="row"
                className="flex items-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {data.deviceIp}
            </th>
            <td className="px-6 py-4">
                {data.createdAt}
            </td>
            <td className="px-6 py-4">
                {data.deviceName}
            </td>
            <td className="px-6 py-4">
                {data.deviceLocation}
            </td>
        </tr>
    )
}

export default function DevicesActivity() {

    const [userInfo, setUserInfo] = useState({});
    const [cookies] = useCookies(['accessToken']);
    const [listOfDevice, setListOfDevice] = useState([]);

    const response = async () => {
        let data = await resApi('personal/user');
        setUserInfo(data.data);
    }, handleListDevice = async () => {
        let data = await resApi('personal/devices');
        setListOfDevice(data.data);
    };

    useEffect(() => {
        response();
        handleListDevice();
    }, [userInfo, listOfDevice]);


    return (
        <div className="flex flex-col">
            {
                cookies?.accessToken ? <></> : <Navigate to="/user/login"/>
            }


            {/* Sidebar Menu */}
            <SettingSidebar data={userInfo}>
                <div>
                    <span className="font-bold text-blue-100 text-2xl">Devices connected</span>
                </div>

                <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">

                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            {
                                ['Device Ip', 'Created At', 'Device Name', 'Device Location'].map(e => <th scope="col"
                                                                                                           className="px-6 py-3">{e}</th>)
                            }
                        </tr>
                        </thead>
                        <tbody>
                        {
                            listOfDevice.map(e => <Item data={e}/>)
                        }
                        </tbody>
                    </table>
                </div>
            </SettingSidebar>

        </div>
    )
}