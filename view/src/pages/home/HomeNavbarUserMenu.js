import Settings from 'img/settings.svg';
import DropdownMenu from "component/DropdownMenu";
import {Navigate} from "react-router-dom";

function HomeNavbarUserMenu({className}) {
    return (
        <DropdownMenu className={className}>
            {
                [
                    {name: 'Settings', img: Settings, navigate: () => (<Navigate to="/home/settings"/>)}
                ]
            }
        </DropdownMenu>
    );
}

export default HomeNavbarUserMenu;