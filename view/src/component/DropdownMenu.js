import Channel from 'img/channel.svg';
import Group from 'img/group.svg';
import SavedMessage from 'img/saved-message.svg';

function Item({children}) {
    return (
        <li className="flex rounded-lg delay-50 px-2 py-2 mx-2 hover:bg-blue-300 hover:bg-blue-50 hover:cursor-pointer"
            key={children.name}>
            <img src={children?.img} className="mr-2" alt="Icon"/>
            <span
                className="block font-bold text-white">{children.name}</span>
        </li>
    );
}


export default function DropdownMenu({className}) {
    return (
        <div
            className={"z-10 absolute mt-14 divide-y divide-gray-100 shadow w-44 " + className}>
            <ul className="py-2 rounded-lg text-sm bg-blue-200">
                {
                    [
                        {name: 'Group', img: Group},
                        {name: 'Channel', img: Channel},
                        {name: 'Saved Message', img: SavedMessage}
                    ].map(e => <Item>{e}</Item>)
                }
            </ul>
        </div>

    );
}