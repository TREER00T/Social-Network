import {Dialog, Button} from "@material-tailwind/react";
import {Fragment} from "react";
import SendMessage from 'img/send-message.svg';
import BackIcon from 'img/arrow-left.svg';

export default function UserProfile({
                                        handleOpen,
                                        open,
                                        info: {
                                            img,
                                            defaultColor,
                                            lastName,
                                            username,
                                            bio,
                                            isActive,
                                            publicLink,
                                            description,
                                            _id,
                                            activities,
                                            name,
                                            type
                                        }
                                    }) {
    return (
        <Fragment>
            <Dialog open={open} handler={handleOpen} className="py-2 px-4">

                <div className="flex mt-2 justify-between">
                    <Button
                        variant="text"
                        color="blue"
                        onClick={handleOpen}
                        className="mr-1 outline-none">
                        <img src={BackIcon} alt="Icon"/>
                    </Button>
                    <span className="font-bold text-blue-100">{type === 'E2E' ? `@${username}` : ''}</span>
                    <Button
                        variant="text"
                        color="blue"
                        onClick={handleOpen}
                        className="mr-1 outline-none">
                        <img src={SendMessage} alt="Icon"/>
                    </Button>
                </div>

                <div className="flex mt-4 items-center">
                    {
                        img ?
                            <img className="w-20 h-20 rounded-lg shadow-xl" src={img} alt="User Avatar"/> :
                            <div className="flex flex-col w-20 h-20 rounded-lg place-content-center shadow-xl" style={{
                                color: 'white',
                                backgroundColor: defaultColor
                            }}><span className="text-center">{name?.slice(0, 2)}</span></div>
                    }
                    <div className="flex flex-col ml-4">
                        <div className="text-base font-semibold text-gray-750">{name} {lastName}</div>
                        {
                            isActive && type === 'E2E' ? <div className="flex items-center">
                                <div
                                    className={(isActive ? "bg-green-500" : "bg-red-500") + " h-2.5 w-2.5 rounded-full mr-2"}/>
                                {
                                    isActive ? 'Online' : 'Offline'
                                }
                            </div> : <></>
                        }
                    </div>
                </div>

                {
                    description || bio ? <div className="flex flex-col mt-4">
                        <span
                            className="font-bold text-gray-900">{type === 'Group' || type === 'Channel' ? 'Description' : type === 'E2E' ? 'Bio' : ''}</span>
                        <span className="font-sm text-gray-600">{description ?? bio}</span>
                    </div> : <></>
                }
                {
                    publicLink ? <div className="flex flex-col mt-4">
                        <span className="font-bold text-gray-900">Public Link</span>
                        <span className="font-sm text-gray-600">{publicLink}</span>
                    </div> : <></>
                }

                {/*{*/}
                {/*    activities.length === 0 ? <div className="divide-y divide-slate-200 pt-3">*/}
                {/*        sdds*/}
                {/*    </div> : <></>*/}
                {/*}*/}

            </Dialog>
        </Fragment>
    )
}