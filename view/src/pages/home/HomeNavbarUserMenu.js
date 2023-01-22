import Settings from 'img/settings.svg';
import Logout from 'img/logout.svg';
import {DropdownMenu, DropDownItem} from "component/DropdownMenu";
import {Navigate} from "react-router-dom";

function HomeNavbarUserMenu({className, getHasClicked}) {
    return (
        <DropdownMenu className={className}>
            <DropDownItem key="settings" name="Settings" img={Settings} navigate={<Navigate to="/home/settings"/>}/>
            <DropDownItem key="logout" name="Logout" img={Logout} navigate={<Navigate to="/user/login"/>}
                          haveAction={true} getHasClicked={getHasClicked}/>
        </DropdownMenu>
    );
}

export default HomeNavbarUserMenu;