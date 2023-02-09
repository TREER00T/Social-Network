import {Navigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import SettingSidebar from "pages/setting/room/SettingSidebar";
import {getRoomType} from "util/Utils";
import {resApi} from "common/fetch";
import {getRoomId} from "util/Utils";
import {useEffect, useState} from "react";
import ListOfUserItem from "component/ListOfUserItem";
import Button from "component/Button";


export default function AdminsActivity() {
    const roomType = getRoomType().toLowerCase();
    const [cookies] = useCookies(['apiKey']);
    const [listOfAdmin, setListOfAdmin] = useState([]);

    const response = async () => {
        let data = await resApi(`${roomType}/admins`, {
            query: {
                [roomType === 'group' ? 'groupId' : 'channelId']: getRoomId()
            }
        });
        setListOfAdmin(data.data);
    }, handleDeleteAdmin = async d => {
        await resApi(`${roomType}/admins`, {
            method: 'DELETE',
            body: {
                targetUserId: d,
                [roomType === 'group' ? 'groupId' : 'channelId']: getRoomId()
            }
        })
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
                    <span className="font-bold text-blue-100 text-2xl">Admin List</span>
                </div>


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
                            listOfAdmin.map((e, i) => <ListOfUserItem key={i} data={e}>
                                <td className="py-4">
                                    <Button variant="text" color="blue"
                                            onClick={() => handleDeleteAdmin(e._id)}>Delete</Button>
                                </td>
                            </ListOfUserItem>)
                        }
                        </tbody>
                    </table>
                </div>

            </SettingSidebar>
        </div>
    )
}