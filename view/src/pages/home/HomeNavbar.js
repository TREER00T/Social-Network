import ImageButton from "component/ImageButton";
import Menu from "img/menu.svg";
import SearchOn from "img/search-on.svg";
import SearchOff from "img/search-off.svg";
import Add from "img/add.svg";
import {useRef, useState} from "react";
import {Navigate} from "react-router-dom";
import EditText from "component/EditText";
import useOutsideAlerter from "common/useOutsideAlerter";
import HomeNavbarDropDownMenu from "pages/home/HomeNavbarDropDownMenu";
import HomeNavbarUserMenu from "pages/home/HomeNavbarUserMenu";
import AgreeDialog from "component/AgreeDialog";
import {removeAllCookie} from "common/removeAllCookie";
import {resApi} from "common/fetch";

function HomeNavbar({getTextSearched}) {

    const wrapperRef = useRef('navbar');
    const [hasSearchOff, setHasSearchOff] = useState(true);
    const [accessToLogout, setAccessToLogout] = useState(false);
    const [hasClickedLogout, setHasClickedLogout] = useState(false);
    const [hasOpenedUserMenu, setHasOpenedUserMenu] = useState(false);
    const [hasOpenedOptionMenu, setHasOpenedOptionMenu] = useState(false);

    useOutsideAlerter(wrapperRef, () => {
        setHasSearchOff(true);
        setHasOpenedUserMenu(false);
        setHasOpenedOptionMenu(false);
    });

    const handleClickedLogout = d => setHasClickedLogout(d),
        handleOptionMenuState = () => setHasOpenedOptionMenu(!hasOpenedOptionMenu),
        handleUserMenu = () => setHasOpenedUserMenu(!hasOpenedUserMenu),
        handleSearchState = () => setHasSearchOff(!hasSearchOff),
        handleAccessToLogout = async d => {
            setAccessToLogout(d);
            if (d) {
                await resApi('personal/account', {
                    method: 'POST'
                });
                removeAllCookie();
            }
        };

    return (
        <div className="flex my-2 mx-3 relative" ref={wrapperRef}>

            <ImageButton src={Menu} onClick={handleUserMenu}
                         innerRef={wrapperRef}/>

            <span className="mt-1 ml-3 font-bold text-blue-100 text-xl">
                Telegram
            </span>

            <div className="flex absolute inset-y-0 right-0">
                {
                    hasSearchOff ? <></> :
                        <EditText className="mr-5"
                                  getText={getTextSearched} label="Search"/>
                }
                <ImageButton src={hasSearchOff ? SearchOn : SearchOff} onClick={handleSearchState}/>

                <ImageButton className="ml-4" src={Add} onClick={handleOptionMenuState}/>

            </div>
            {
                hasOpenedOptionMenu ? <HomeNavbarDropDownMenu className="inset-y-0 right-0"/> : <></>
            }
            {
                hasOpenedUserMenu ? <HomeNavbarUserMenu getHasClicked={handleClickedLogout}/> : <></>
            }

            <AgreeDialog
                handler={handleClickedLogout}
                accessToNavigate={hasClickedLogout}
                getAccessToAction={handleAccessToLogout}
                children="Do you want to logout?"/>

            {
                accessToLogout ? <Navigate to="/user/login"/> : <></>
            }
        </div>
    );


}

export default HomeNavbar;