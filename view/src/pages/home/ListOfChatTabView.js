import TabView from "component/TabView";
import {useState} from "react";
import {resApi} from "common/fetch";
import Io from 'common/io';
import SavedMessage from "img/saved-message.svg";

let {socket} = new Io('common');

function Item({data: {img, _id, name, defaultColor, type}, getType}) {

    const isSavedMessage = type === 'SA';

    const handleClick = () => {
        getType(type);
    };

    return (
        <li className="flex py-2 hover:cursor-pointer hover:bg-gray-100 hover:rounded-lg"
            onClick={handleClick}>
            {
                img ?
                    <img className="ml-2 h-12 rounded-full" src={img} alt="User Avatar"/> :
                    <div className="flex flex-col ml-2 w-12 h-12 rounded-full place-content-center mr-3" style={{
                        color: 'white',
                        backgroundColor: defaultColor
                    }}>{isSavedMessage ? <img className="h-6 rounded-full" src={SavedMessage} alt="User Avatar"/> :
                        <span className="text-center">{name.slice(0, 2)}</span>}</div>
            }
            <span
                className="py-4 my-auto text-sm font-medium text-slate-900">{name}</span>
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
                        defaultColor: '#418aff'
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

            <ul role="list" className="divide-y divide-slate-200 pt-3">

                {
                    [
                        {
                            type: 'SA',
                            name: 'Saved Message',
                            defaultColor: '#418aff'
                        },
                        {
                            type: 'SA',
                            name: 'Saved Message',
                            defaultColor: '#e33737'
                        },
                        {
                            type: 'SA',
                            name: 'Saved Message',
                            defaultColor: '#ffae00'
                        }
                    ].map(e => <Item data={e}/>)
                }

                {
                    searchData ? searchData.map(e => <Item
                        data={e}/>) : userActivities.map(e => <Item data={e}/>)
                }

            </ul>

        </div>
    )

}