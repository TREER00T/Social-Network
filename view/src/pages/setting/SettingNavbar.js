import {resApi} from 'common/fetch';
import {useEffect, useState} from "react";

export default function SettingNavbar() {

    const [data, setData] = useState({});

    const response = async () => {
        let data = await resApi('personal/user');
        setData(data);
    };

    // useEffect( () => {
    //      response();
    // }, [data]);

    return (
        <div className="flex m-4 pl-5">
            {data.data?.img ? <img className="h-14 w-14 rounded-full" src={data.data?.img} alt="My Avatar"/> :
                <div className="flex flex-col h-14 w-14 rounded-full place-content-center" style={{
                    color: 'white',
                    backgroundColor: data.data?.defaultColor
                }}><span className="text-center">{data.data?.name.slice(0, 2)}</span></div>}
            <div className="flex flex-col ml-3 place-content-center">
                <span className="font-bold">{data.data?.name} {data.data?.lastName}</span>
                <span className="text-sm text-slate-500 truncate">Your personal account</span>
            </div>
        </div>
    );
}