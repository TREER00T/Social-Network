import TabHeaderView from "component/TabHeaderView";
import {useEffect, useState} from "react";
import {resApi} from "common/fetch";
import Io from 'common/io';
import SavedMessage from "img/saved-message.svg";
import NotFound from "component/NotFound";
import {useCookies} from "react-cookie";

function Item({data: {img, defaultColor, lastName, username, publicLink, bio, description, _id, name, type}, getData}) {

    const isSavedMessage = type === 'SA';

    const handleClick = () => getData({
        img,
        defaultColor,
        lastName,
        username,
        publicLink,
        bio,
        description,
        _id,
        name,
        type
    });

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

export default function ListOfChatWithTabView({dataSearched, hasSearchViewOpen, getItemData}) {

    const [userActivities, setUserActivities] = useState([
        {
            type: 'Channel',
            publicLink: 'sdllddll',
            _id: '1',
            name: 'Channel',
            defaultColor: '#418aff'
        },
        {
            type: 'Group',
            _id: '2',
            name: 'Group',
            defaultColor: '#418aff'
        },
        {
            type: 'SA',
            _id: '3',
            name: 'Saved Message',
            defaultColor: '#e33737'
        },
        {
            type: 'E2E',
            _id: '4',
            username: 'UsernameE2E',
            bio: 'Test simple text',
            name: 'E2E',
            defaultColor: '#ffae00'
        }
    ]);
    const [stateUserActivities, setStateUserActivities] = useState([
        {
            type: 'Channel',
            _id: '1',
            publicLink: 'sdllddll',
            name: 'Channel',
            defaultColor: '#418aff'
        },
        {
            type: 'Group',
            _id: '2',
            name: 'Group',
            defaultColor: '#418aff'
        },
        {
            type: 'SA',
            _id: '3',
            name: 'Saved Message',
            defaultColor: '#e33737'
        },
        {
            type: 'E2E',
            _id: '4',
            username: 'UsernameE2E',
            name: 'E2E',
            defaultColor: '#ffae00'
        }
    ]);
    const [cookies] = useCookies(['phone']);
    const [searchData, setSearchData] = useState([]);
    const [haveNotActivity, setHaveNotActivity] = useState(false);
    const assign = (o, t) => Object.assign(o ?? {}, {type: t});
    const [hasExistSavedMessage, setHasExistSavedMessage] = useState(false);
    const dataComposition = data => [
        assign(data?.e2es, 'E2E'),
        assign(data?.groups, 'Group'),
        assign(data?.channels, 'Channel')
    ];


    const handleUserActivities = d => {
        let {socket} = new Io('common');

        socket.emit('onUserActivities', {type: d.toLowerCase()});
        socket.on('emitUserActivities', d => {
            if (typeof d === 'object') {
                let result = dataComposition(d);

                if (hasExistSavedMessage)
                    result.unshift({
                        _id: cookies.phone,
                        type: 'SA',
                        name: 'Saved Message',
                        defaultColor: '#418aff'
                    });

                setUserActivities(result);
                setStateUserActivities(result);
            } else {
                if (d.length === 0)
                    setHaveNotActivity(!haveNotActivity);
                setUserActivities(d);
                setStateUserActivities(d);
            }
        });
    }, handleColumnSelected = d => {
        // handleUserActivities(d);

        let res = stateUserActivities;

        if (d.toLowerCase() !== 'all')
            res = res.filter(it => it.type === d);

        setUserActivities(res);
    }, handleHasExistSavedMessage = async () => {
        let data = await resApi('personal/savedMessage/exist');
        setHasExistSavedMessage(data?.statusCode);
    }, handleSearchResponse = async () => {
        let data = await resApi(`common/search?v=${dataSearched}`);

        setHaveNotActivity(data?.statusCode === 404);
        if (data?.statusCode === 200) {
            await handleHasExistSavedMessage();
            setSearchData(dataComposition(data.data));
        }
    };

    // useEffect(() => {
    //     if (!dataSearched)
    //         handleUserActivities('all');
    // });

    // if (dataSearched && hasSearchViewOpen)
    //     handleSearchResponse();

    return (
        <div className="flex flex-col ml-3">
            <TabHeaderView
                headers={['All', 'E2E', 'Group', 'Channel']}
                getColumnSelected={handleColumnSelected}/>

            {
                haveNotActivity ? <NotFound/> : <></>
            }

            <ul role="list" className="divide-y divide-slate-200 pt-3">

                {
                    searchData.length > 0 ?
                        searchData.map((e, i) =>
                            <Item data={e}
                                  key={i}
                                  getData={getItemData}/>) :
                        userActivities.map((e, i) =>
                            <Item data={e}
                                  key={i}
                                  getData={getItemData}/>)
                }

            </ul>

        </div>
    )

}