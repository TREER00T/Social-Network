import TabView from "component/TabView";
import {useState} from "react";

function Item() {
    return (
        <li className="flex py-4 first:pt-0 last:pb-0">
            <img className="h-10 w-10 rounded-full" src="{person.imageUrl}" alt=""/>
            <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-slate-900">idfdjo</p>
                <p className="text-sm text-slate-500 truncate">hskksd</p>
            </div>
        </li>
    )
}

export default function ListOfChatTabView() {

    const [columnSelected, setColumnSelected] = useState('All');

    const handleColumnSelected = (d) => {
        setColumnSelected(d);
    };


    return (
        <div>
            <TabView headers={['All', 'E2E', 'Group', 'Channel']} getColumnSelected={handleColumnSelected}/>

            <ul role="list" className="p-6 divide-y divide-slate-200">



            </ul>

        </div>
    )

}