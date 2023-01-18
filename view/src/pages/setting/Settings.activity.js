import SettingNavbar from "pages/setting/SettingNavbar";
import SettingMenuWithContent from "pages/setting/SettingMenuWithContent";
import {useCookies} from "react-cookie";
import {Navigate} from "react-router-dom";

export default function SettingsActivity() {

    const [cookies] = useCookies(['accessToken']);

    return (
        <div className="flex flx-col">
            {
              //  cookies?.accessToken ? <></> : <Navigate to="/user/login"/>
            }

            {/* Navbar */}
            <SettingNavbar/>

            {/* Body */}
            <SettingMenuWithContent/>

        </div>
    )
}