import {useState} from "react";


function TabHeader({children, clickedIndex, onClick, onChange}) {
    return (
        <li onClick={onClick}
            className="mr-5">
            <span
                onChange={onChange}
                className={(clickedIndex === children ? "text-white bg-blue-200 active drop-shadow-lg" :
                    "hover:text-gray-900 hover:bg-gray-100") + ' inline-block px-4 py-3 rounded-lg hover:cursor-pointer drop-shadow-lg'}>{children}</span>
        </li>
    )
}

export default function TabView({className, headers, getColumnSelected}) {
    const [clickedIndex, setOnClickedIndex] = useState(headers[0]);

    const handleClick = e => {
        setOnClickedIndex(e.target.innerText);
        getColumnSelected(e.target.innerText);
    }

    return (
        <div className={className}>
            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                {
                    headers.map(e => <TabHeader key={e} onClick={handleClick}
                                                clickedIndex={clickedIndex}>{e}</TabHeader>)
                }
            </ul>
        </div>
    )
}