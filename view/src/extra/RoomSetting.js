import {url} from 'util/Utils';

export const RoomSettingSidebarItems = type => {
    let u = url();
    let urlPath = u.split('/');
    urlPath.shift();

    if (urlPath.length > 3) {
        urlPath.pop();
        u = `/${urlPath.join('/')}`;
    }

    return [
        {
            name: `${type} Profile`,
            icon: (
                type === 'Group' ?
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-users"
                         width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"
                         strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"/>
                    </svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-speakerphone"
                         width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"
                         strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M18 8a3 3 0 0 1 0 6"/>
                        <path d="M10 8v11a1 1 0 0 1 -1 1h-1a1 1 0 0 1 -1 -1v-5"/>
                        <path
                            d="M12 8h0l4.524 -3.77a0.9 .9 0 0 1 1.476 .692v12.156a0.9 .9 0 0 1 -1.476 .692l-4.524 -3.77h-8a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h8"/>
                    </svg>
            ),
            url: u
        },
        {
            name: 'Admins',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-user" width="24"
                     height="24"
                     viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"
                     strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M12 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/>
                    <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"/>
                </svg>
            ),
            url: `${u}/admins`
        },
        {
            name: 'Links',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-link" width="24"
                     height="24"
                     viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"
                     strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5"/>
                    <path d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5"/>
                </svg>
            ),
            url: `${u}/links`
        }

    ]
}