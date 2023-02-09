import {useState} from "react";

export default function SettingItem({data: {url, icon, name}}) {
    const isValidPath = url === window.location.pathname;
    const [hasClicked, setHasClicked] = useState(false);

    const handleClick = () => setHasClicked(!hasClicked);

    return (
        <li>
            <a href={url}
               onClick={handleClick}
               className={(hasClicked || isValidPath ? "bg-gray-200 " : "") + "flex items-center space-x-3 text-gray-700 p-2 rounded-md font-medium hover:bg-gray-200 focus:shadow-outline"}>
                <span className={hasClicked || isValidPath ? "text-blue-100" : "text-gray-600"}>
                    {icon}
                </span>
                <span className={hasClicked || isValidPath ? "text-blue-100" : "text-gray-600"}>{name}</span>
            </a>
        </li>
    )
}