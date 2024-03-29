import {useState} from "react";

export function DropDownItem({getHasClicked, name, img, sendReq, haveAction, navigate}) {
    const [hasClicked, setHasClicked] = useState(false);

    const handleClickItem = () => {
        if (typeof sendReq === 'function')
            sendReq();
        setHasClicked(!hasClicked);
        if (getHasClicked)
            getHasClicked(!hasClicked);
    };

    return (
        <li className="flex rounded-lg delay-50 px-2 py-2 mx-2 hover:bg-blue-300 hover:cursor-pointer"
            key={name}
            onClick={handleClickItem}>
            <img src={img} className="mr-2" alt="Icon"/>
            <span
                className="block font-bold text-white">{name}</span>

            {
                hasClicked && !haveAction && navigate ? navigate : <></>
            }
        </li>
    );
}

export function DropdownMenu({className, children, style, wrapperRef}) {
    return (
        <div
            style={style}
            ref={wrapperRef}
            className={`z-10 absolute mt-14 divide-y divide-gray-100 shadow w-44 ${className}`}>
            <ul className="py-2 rounded-lg text-sm bg-blue-200">
                {
                    children[0].img ?
                        children.map((e, i) => <DropDownItem
                            key={i}
                            navigate={e.navigate}
                            name={e.name}
                            sendReq={e?.sendReq ? e.sendReq() : () => {
                            }}
                            img={e.img}/>) : children
                }
            </ul>
        </div>
    );
}