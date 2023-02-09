import {Navigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import SettingSidebar from "pages/setting/room/SettingSidebar";

export default function LinksActivity() {
    const [cookies] = useCookies(['apiKey']);

    return (
        <div className="flex flex-col">
            {
                cookies?.apiKey ? <></> : <Navigate to="/user/login"/>
            }

            <SettingSidebar>

                <div className="mb-8">
                    <span className="font-bold text-blue-100 text-lg">Links</span>
                </div>

                <div>

                </div>
            </SettingSidebar>
        </div>
    )
}