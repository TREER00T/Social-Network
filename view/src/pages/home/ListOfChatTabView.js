import TabView from "component/TabView";
import {useEffect, useState} from "react";
import {resApi} from "common/fetch";
import Io from 'common/io';

let {socket} = new Io('common');

function Item({data: {img, _id, name, defaultColor, type}}) {
    return (
        <li className="flex py-4 first:pt-0 last:pb-0 hover:cursor-pointer hover:bg-gray-600">
            {
                img ?
                    <img className="h-10 rounded-full" src={img} alt="User Avatar"/> :
                    <div className="flex flex-col w-10 h-10 rounded-full place-content-center" style={{
                        color: 'white',
                        backgroundColor: defaultColor
                    }}><span className="text-center">{name.slice(0, 2)}</span></div>
            }
            <img className="h-10 rounded-full" src={img} alt="User Avatar"/>
            <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-slate-900">{name}</p>
            </div>
        </li>
    )
}

export default function ListOfChatTabView({dataSearched, hasSearchViewOpen}) {

    const [userActivities, setUserActivities] = useState([]);
    const [searchData, setSearchData] = useState([]);
    const [hasExistSavedMessage, setHasExistSavedMessage] = useState(false);
    const [haveNotActivity, setHaveNotActivity] = useState(false);
    const assign = (o, t) => Object.assign(o ?? {}, {type: t});
    const dataComposition = (data) => [
        assign(data?.e2es, 'E2E'),
        assign(data?.groups, 'Group'),
        assign(data?.channels, 'Channel')
    ];


    const handleUserActivities = d => {
        socket.emit('onUserActivities', {type: d.toLowerCase()});
        socket.on('emitUserActivities', d => {
            if (typeof d === 'object') {
                let result = dataComposition(d);

                if (hasExistSavedMessage)
                    result.unshift({
                        _id: localStorage.getItem('phone'),
                        type: 'SA',
                        name: 'Saved Message',
                        defaultColor: '#2073f8'
                    });

                setUserActivities(result);
            } else {
                if (d.length === 0)
                    setHaveNotActivity(!haveNotActivity);
                setUserActivities(d)
            }
        });
    }, handleColumnSelected = d => {
        handleUserActivities(d);
    }, handleHasExistSavedMessage = async () => {
        let data = await resApi('personal/savedMessage/exist');
        setHasExistSavedMessage(data?.statusCode);
    }, handleSearchResponse = async () => {
        let data = await resApi(`common/search?v=${dataSearched}`);

        if (data?.statusCode === 200) {
            await handleHasExistSavedMessage();
            setHaveNotActivity(data?.statusCode === 404);
            setSearchData(dataComposition(data.data));
        }
    };

    if (dataSearched && hasSearchViewOpen)
        handleSearchResponse();
    else
        handleUserActivities('all');

    return (
        <div className="flex flex-col">
            <TabView headers={['All', 'E2E', 'Group', 'Channel']} getColumnSelected={handleColumnSelected}/>

            {
                haveNotActivity ?
                    <span className="font-sm text-lg mx-auto my-64 text-center">Not Found!</span> :
                    <></>
            }

            <ul role="list" className="divide-y divide-slate-200">

                {
                    searchData ? searchData.map(e => <Item
                        data={e}/>) : userActivities.map(e => <Item data={e}/>)
                }

            </ul>

        </div>
    )

}