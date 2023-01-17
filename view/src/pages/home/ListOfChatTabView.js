import TabView from "component/TabView";
import {useState} from "react";

function Item({img, _id, name, defaultColor}) {
    return (
        <li className="flex py-4 first:pt-0 last:pb-0">
            {
                img ?
                    <img className="h-10 w-10 rounded-full" src={img} alt="User Avatar"/> :
                    <div className="h-10 w-10 rounded-full" style={{
                        color: defaultColor
                    }}>{name.slice(0, 2)}</div>
            }
            <img className="h-10 w-10 rounded-full" src={img} alt="User Avatar"/>
            <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-slate-900">{name}</p>
            </div>
        </li>
    )
}

export default function ListOfChatTabView() {

    const [columnSelected, setColumnSelected] = useState('All');

    const handleColumnSelected = d => {
        setColumnSelected(d.toLowerCase());
    };


    return (
        <div>
            <TabView headers={['All', 'E2E', 'Group', 'Channel']} getColumnSelected={handleColumnSelected}/>

            <ul role="list" className="p-6 divide-y divide-slate-200">


            </ul>

        </div>
    )

}