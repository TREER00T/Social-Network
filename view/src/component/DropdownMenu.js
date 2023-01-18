import {useState} from "react";

function Item({children}) {
    const [hasClicked, setHasClicked] = useState(false);

    const handleClickItem = () => {
        setHasClicked(!hasClicked);
    };

    return (
        <li className="flex rounded-lg delay-50 px-2 py-2 mx-2 hover:bg-blue-300 hover:cursor-pointer"
            key={children.name}
            onClick={handleClickItem}>
            <img src={children?.img} className="mr-2" alt="Icon"/>
            <span
                className="block font-bold text-white">{children.name}</span>

            {
                hasClicked ? children.navigate() : <></>
            }
        </li>
    );
}

export default function DropdownMenu({className, children}) {
    return (
        <div
            className={"z-10 absolute mt-14 divide-y divide-gray-100 shadow w-44 " + className}>
            <ul className="py-2 rounded-lg text-sm bg-blue-200">
                {
                    children.map(e => <Item>{e}</Item>)
                }
            </ul>
        </div>
    );
}