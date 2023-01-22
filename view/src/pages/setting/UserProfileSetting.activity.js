import {useCookies} from "react-cookie";
import {useState} from "react";
import SettingSidebar from "pages/setting/SettingSidebar";
import {resApi} from "common/fetch";

export default function UserProfileSettingActivity(){
    const [cookies] = useCookies(['accessToken']);
    const [data, setData] = useState({});

    const response = async () => {
        let data = await resApi('personal/user');
        setData(data);
    };

    // useEffect( () => {
    //      response();
    // }, [data]);

    return (
        <div className="flex flex-col">
            {
                //  cookies?.accessToken ? <></> : <Navigate to="/user/login"/>
            }

            {/* Sidebar Menu */}
            <SettingSidebar userInfo={data.data}>

            </SettingSidebar>

        </div>
    )
}