import {useState} from "react";
import {settingSidebarItems} from "extra/setting";

function Item({obj}) {

    const [hasClicked, setHasClicked] = useState(false);
    const isValidPath = obj.url === window.location.pathname;

    const handleClick = () => {
        setHasClicked(!hasClicked);
    };

    return (
        <li>
            <a href={obj.url}
               onClick={handleClick}
               className={(hasClicked || isValidPath ? "bg-gray-200 " : "") + "flex items-center space-x-3 text-gray-700 p-2 rounded-md font-medium hover:bg-gray-200 focus:shadow-outline"}>
                <span className={hasClicked || isValidPath ? "text-blue-100" : "text-gray-600"}>
                    {obj.icon}
                </span>
                <span className={hasClicked || isValidPath ? "text-blue-100" : "text-gray-600"}>{obj.name}</span>
            </a>
        </li>
    )
}

export default function SettingSidebar({userInfo, children}) {
    return (
        <div className="flex flex-wrap bg-gray-80">

            {/* Sidebar Menu */}
            <div className="w-3/12 bg-white rounded p-3 shadow-lg h-screen sticky top-0">
                <div className="flex items-center space-x-4 p-2 mb-5">
                    {userInfo?.img ? <img className="h-12 rounded-full" src={userInfo?.img} alt="My Avatar"/> :
                        <div className="flex flex-col w-12 h-12 rounded-full place-content-center" style={{
                            color: 'white',
                            backgroundColor: userInfo?.defaultColor
                        }}><span className="text-center">{userInfo?.name.slice(0, 2)}</span>
                        </div>
                    }
                    <div className="flex flex-col ml-3 place-content-center">
                        <h4 className="font-semibold text-lg text-gray-700 capitalize font-poppins tracking-wide">{userInfo?.name} {userInfo?.lastName}</h4>
                        <span className="text-sm tracking-wide flex items-center space-x-1 text-gray-600">Your personal account</span>
                    </div>
                </div>
                <ul className="space-y-2 text-sm">
                    {
                        settingSidebarItems.map(o => <Item obj={o}/>)
                    }
                </ul>
            </div>

            {/* Menu Item Body */}
            <div className="w-9/12 p-4">
                {
                    children
                }
            </div>
        </div>
    )
}