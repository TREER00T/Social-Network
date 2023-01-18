import ImageButton from "component/ImageButton";
import Menu from "img/menu.svg";
import SearchOn from "img/search-on.svg";
import SearchOff from "img/search-off.svg";
import Add from "img/add.svg";
import {useRef, useState} from "react";
import EditText from "component/EditText";
import useOutsideAlerter from "common/useOutsideAlerter";
import HomeNavbarDropDownMenu from "pages/home/HomeNavbarDropDownMenu";
import HomeNavbarUserMenu from "pages/home/HomeNavbarUserMenu";

function HomeNavbar({getSearchText}) {

    const wrapperRef = useRef('navbar');
    const [hasSearchOff, setHasSearchOff] = useState(true);
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
                                  ref={wrapperRef}
                                  getText={getSearchText} label="Search"/>
                }
                {
                    hasSearchOff ?
                        <ImageButton src={SearchOn} onClick={handleSearchState}/> :
                        <ImageButton src={SearchOff} onClick={handleSearchState}/>
                }

                <ImageButton className="ml-4" src={Add} onClick={handleOptionMenuState}/>

            </div>
            {
                hasOpenedOptionMenu ? <HomeNavbarDropDownMenu className="inset-y-0 right-0"/> : <></>
            }
            {
                hasOpenedUserMenu ? <HomeNavbarUserMenu/> : <></>
            }
        </div>
    );


}

export default HomeNavbar;