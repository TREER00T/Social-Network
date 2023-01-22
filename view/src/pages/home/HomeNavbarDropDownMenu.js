import Channel from 'img/channel.svg';
import Group from 'img/group.svg';
import SavedMessage from 'img/saved-message.svg';
import {Navigate} from "react-router-dom";
import {DropdownMenu} from "component/DropdownMenu";

function HomeNavbarDropDownMenu({className}) {
    return (
        <DropdownMenu className={className}>
            {
                [
                    {name: 'Group', img: Group, navigate: (<Navigate to="/home/create/group"/>)},
                    {name: 'Channel', img: Channel, navigate: (<Navigate to="/home/create/channel"/>)},
                    {name: 'Saved Message', img: SavedMessage, navigate: (<Navigate to="/home/create/savedMessage"/>)}
                ]
            }
        </DropdownMenu>
    );
}

export default HomeNavbarDropDownMenu;