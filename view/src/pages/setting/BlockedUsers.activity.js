import {Navigate} from "react-router-dom";
import SettingSidebar from "pages/setting/SettingSidebar";
import {useEffect, useState} from "react";
import {resApi} from "common/fetch";
import {useCookies} from "react-cookie";
import Button from "component/Button";


function Item({data: {img, defaultColor, name, lastName, isActive, _id}}) {

    const handleDisableBlockedUser = async () => {
        await resApi('e2e/user/block', {
            method: 'PUT',
            body: {
                targetUserId: _id
            }
        });
    };

    return (
        <tr className="bg-white hover:bg-gray-50">
            <th scope="row"
                className="flex items-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {
                    img ?
                        <img className="w-10 h-10 rounded-full" src={img} alt="User Avatar"/> :
                        <div className="flex flex-col w-10 h-10 rounded-full place-content-center" style={{
                            color: 'white',
                            backgroundColor: defaultColor
                        }}><span className="text-center">{name?.slice(0, 2)}</span></div>
                }
                <div className="pl-3">
                    <div className="text-base font-semibold">{name} {lastName}</div>
                </div>
            </th>
            <td className="px-6 py-4">
                <div className="flex items-center">
                    <div
                        className={(isActive ? "bg-green-500" : "bg-red-500") + " h-2.5 w-2.5 rounded-full mr-2"}/>
                    {
                        isActive ? 'Online' : 'Offline'
                    }
                </div>
            </td>
            <td className="py-4">
                <Button variant="text" color="blue" onClick={handleDisableBlockedUser}>Disable</Button>
            </td>
        </tr>
    )
}


export default function BlockedUsersActivity() {

    const [userInfo, setUserInfo] = useState({});
    const [cookies] = useCookies(['apiKey']);
    const [listOfBlockedUsers, setListOfBlockedUsers] = useState([]);

    const response = async () => {
        let data = await resApi('personal/user');
        setUserInfo(data.data);
    }, handleListOfBlockedUsers = async () => {
        let data = await resApi('personal/blockUsers');
        setListOfBlockedUsers(data);
    };

    useEffect(() => {
        response();
        handleListOfBlockedUsers();
    }, []);

    return (
        <div className="flex flex-col">
            {
                cookies?.apiKey ? <></> : <Navigate to="/user/login"/>
            }


            {/* Sidebar Menu */}
            <SettingSidebar userInfo={userInfo}>

                <div>
                    <span className="font-bold text-blue-100 text-2xl">Block List</span>
                </div>

                {
                    listOfBlockedUsers.statusCode !== 404 ?
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">

                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    {
                                        ['Name', 'Status', 'Action']
                                            .map((e, i) =>
                                                <th scope="col"
                                                    key={i}
                                                    className="px-6 py-3">{e}</th>)
                                    }
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    listOfBlockedUsers?.data?.map((e, i) => <Item key={i} data={e}/>)
                                }
                                </tbody>
                            </table>
                        </div> :
                        <div className="flex  items-center justify-center h-screen">
                            <span className="font-bold text-gray-500 text-lg">Block list was empty!</span>
                        </div>
                }

            </SettingSidebar>

        </div>
    )
}