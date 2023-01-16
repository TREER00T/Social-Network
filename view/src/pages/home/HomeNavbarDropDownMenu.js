import Channel from 'img/channel.svg';
import Group from 'img/group.svg';
import SavedMessage from 'img/saved-message.svg';
import DropdownMenu from "component/DropdownMenu";

function HomeNavbarDropDownMenu({className}){
    return(
        <DropdownMenu className={className}>
            {
                [
                    {name: 'Group', img: Group},
                    {name: 'Channel', img: Channel},
                    {name: 'Saved Message', img: SavedMessage}
                ]
            }
        </DropdownMenu>
    );
}

export default HomeNavbarDropDownMenu;