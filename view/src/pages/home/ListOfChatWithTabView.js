import TabHeaderView from "component/TabHeaderView";
import {useEffect, useState} from "react";
import {resApi} from "common/fetch";
import SavedMessage from "img/saved-message.svg";
import NotFound from "component/NotFound";
import {useCookies} from "react-cookie";
import {assign, dataComposition} from "util/Utils";

function Item({
                  data: {
                      img,
                      defaultColor,
                      lastName,
                      username,
                      publicLink,
                      bio,
                      description,
                      isActive,
                      _id,
                      name,
                      type
                  },
                  getData
              }) {

    const isSavedMessage = type === 'SA';

    const handleClick = () => getData({
        img,
        defaultColor,
        lastName,
        username,
        publicLink,
        bio,
        description,
        isActive,
        _id,
        name,
        type
    });

    return (
        <li className="flex py-2 hover:cursor-pointer hover:bg-gray-100 hover:rounded-lg"
            onClick={handleClick}>
            {
                img ?
                    <img className="ml-2 h-12 w-12 rounded-full mr-3 shadow-xl" src={img} alt="User Avatar"/> :
                    <div className="flex flex-col ml-2 w-12 h-12 rounded-full place-content-center mr-3 shadow-xl"
                         style={{
                             color: 'white',
                             backgroundColor: defaultColor
                         }}>{isSavedMessage ? <img className="h-6 rounded-full" src={SavedMessage} alt="User Avatar"/> :
                        <span className="text-center">{name?.slice(0, 2)}</span>}</div>
            }
            <span
                className="py-4 my-auto text-sm font-medium text-slate-900">{name}</span>
        </li>
    )
}

export default function ListOfChatWithTabView({
                                                  dataSearched, getItemData,
                                                  dataPayloadForLeaveRoom,
                                                  hasClickedLeaveRoom
                                              }) {

    const [cookies] = useCookies(['phone']);
    const [haveActivity, setHaveActivity] = useState(false);
    const [userActivities, setUserActivities] = useState([]);
    const [stateUserActivities, setStateUserActivities] = useState([]);


    const handleUserActivities = async d => {
        let {data} = await resApi('common/rooms', {
            query: {
                type: d
            }
        });
        if (!Array.isArray(data)) {
            let {statusCode} = await resApi('personal/savedMessage/exist');
            let result = dataComposition(data);

            if (statusCode === 200)
                result.unshift({
                    _id: cookies.phone,
                    type: 'SA',
                    name: 'Saved Message',
                    defaultColor: '#418aff'
                });

            setHaveActivity(result.length > 0);
            setUserActivities(result);
            setStateUserActivities(result);
        } else {
            data = assign(data, d);

            setHaveActivity(data.length === 0 && d === 'All' || data.length > 0);
            setUserActivities(data);
            setStateUserActivities(data);
        }
    }, handleColumnSelected = d => {
        handleUserActivities(d);

        let res = stateUserActivities;

        if (d !== 'All')
            res = res.filter(it => it.type === d);

        setUserActivities(res);
    };

    useEffect(() => {
        if (dataSearched.length === 0)
            handleUserActivities('All');
    }, []);

    useEffect(() => {
        if (hasClickedLeaveRoom) {
            let filter = userActivities.filter(o => o._id !== dataPayloadForLeaveRoom.id)
            setUserActivities([...filter]);
        }
    }, [hasClickedLeaveRoom])


    return (
        <div className="flex flex-col ml-3">
            <TabHeaderView
                headers={['All', 'E2E', 'Group', 'Channel']}
                getColumnSelected={handleColumnSelected}/>

            {
                haveActivity || dataSearched ? <></> : <NotFound/>
            }

            <ul role="list" className="divide-y divide-slate-200 pt-3">

                {
                    dataSearched.length !== 0 ?
                        dataSearched.map((e, i) =>
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