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

function HomeNavbar({getSearchText}) {

    const wrapperRef = useRef('navbar');
    const [hasSearchOff, setHasSearchOff] = useState(true);
    const [hasClickedLogout, setHasClickedLogout] = useState(false);
    const [accessToLogout, setAccessToLogout] = useState(false);
    const [hasOpenedOptionMenu, setHasOpenedOptionMenu] = useState(false);
    const [hasOpenedUserMenu, setHasOpenedUserMenu] = useState(false);

    useOutsideAlerter(wrapperRef, () => {
        setHasOpenedOptionMenu(false);
        setHasSearchOff(true);
        setHasOpenedUserMenu(false);
    });

    const handleSearchState = () => {
        setHasSearchOff(!hasSearchOff);
    }, handleOptionMenuState = () => {
        setHasOpenedOptionMenu(!hasOpenedOptionMenu);
    }, handleUserMenu = () => {
        setHasOpenedUserMenu(!hasOpenedUserMenu);
    }, handleAccessToLogout = (d) => {
        setAccessToLogout(d);
        if (d)
            document.cookie.split(";").forEach((c) => {
                document.cookie = c
                    .replace(/^ +/, "")
                    .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
    }, handleClickedLogout = (d) => {
        setHasClickedLogout(d);
    };


    return (
        <div className="flex my-2 mx-3 relative" ref={wrapperRef}>

            <ImageButton src={Menu} onClick={handleUserMenu}
                         ref={wrapperRef}/>

            <span className="mt-1 ml-3 font-bold text-blue-100 text-xl">
                Telegram
            </span>

            <div className="flex absolute inset-y-0 right-0">
                {
                    hasSearchOff ? <></> :
                        <EditText className="mr-5"
                                  getText={getSearchText} label="Search"/>
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
                children='Do you want to logout?'/>

            {
                accessToLogout ? <Navigate to="/user/login"/> : <></>
            }
        </div>
    );


}

export default HomeNavbar;