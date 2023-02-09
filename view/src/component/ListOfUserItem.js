export default function ListOfUserItem({data: {img, defaultColor, name, lastName, isActive, _id}, children}) {

    return (
        <tr className="bg-white hover:bg-gray-50">
            <th scope="row"
                className="flex items-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {
                    img ?
                        <img className="w-10 h-10 rounded-full" src={img} alt="User Avatar"/> :
                        <div className="flex flex-col w-10 h-10 rounded-full place-content-center" style={{
                            color: 'white',
                            backgroundColor: defaultColor
                        }}><span className="text-center">{name?.slice(0, 2)}</span></div>
                }
                <div className="pl-3">
                    <div className="text-base font-semibold">{name} {lastName}</div>
                </div>
            </th>
            <td className="px-6 py-4">
                <div className="flex items-center">
                    <div
                        className={(isActive ? "bg-green-500" : "bg-red-500") + " h-2.5 w-2.5 rounded-full mr-2"}/>
                    {
                        isActive ? 'Online' : 'Offline'
                    }
                </div>
            </td>
            {
                children
            }
        </tr>
    )
}