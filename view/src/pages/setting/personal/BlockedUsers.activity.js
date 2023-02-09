import {Navigate} from "react-router-dom";
import SettingSidebar from "pages/setting/personal/SettingSidebar";
import {useEffect, useState} from "react";
import {resApi} from "common/fetch";
import {useCookies} from "react-cookie";
import ListOfUserItem from "component/ListOfUserItem";
import Button from "component/Button";


export default function BlockedUsersActivity() {

    const [cookies] = useCookies(['apiKey']);
    const [listOfBlockedUsers, setListOfBlockedUsers] = useState([]);

    const handleListOfBlockedUsers = async () => {
        let data = await resApi('personal/blockUsers');
        setListOfBlockedUsers(data);
    }, handleDisableBlockedUser = async id => {
        await resApi('e2e/user/block', {
            method: 'PUT',
            body: {
                targetUserId: id
            }
        });
    };

    useEffect(() => {
        handleListOfBlockedUsers();
    }, []);

    return (
        <div className="flex flex-col">
            {
                cookies?.apiKey ? <></> : <Navigate to="/user/login"/>
            }


            {/* Sidebar Menu */}
            <SettingSidebar>

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
                                    listOfBlockedUsers?.data?.map((e, i) =>
                                        <ListOfUserItem key={i} data={e}>
                                            <td className="py-4">
                                                <Button variant="text" color="blue"
                                                        onClick={() => handleDisableBlockedUser(e._id)}>Disable</Button>
                                            </td>
                                        </ListOfUserItem>)
                                }
                                </tbody>
                            </table>
                        </div> :
                        <div className="flex items-center justify-center mt-72">
                            <span className="font-bold text-gray-500 text-lg">Block list was empty!</span>
                        </div>
                }

            </SettingSidebar>

        </div>
    )
}