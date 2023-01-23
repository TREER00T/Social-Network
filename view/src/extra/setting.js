export const settingSidebarItems = [
    {
        name: 'Account Profile',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-user-circle" width="24"
                 height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"
                 strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <circle cx="12" cy="12" r="9"/>
                <circle cx="12" cy="10" r="3"/>
                <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855"/>
            </svg>
        ),
        url: '/home/settings'
    },
    {
        name: 'Privacy and Security',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-shield-half-filled"
                 width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"
                 strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3"/>
                <path d="M12 3v18"/>
                <path d="M12 11h8.9"/>
                <path d="M12 8h8.9"/>
                <path d="M12 5h3.1"/>
                <path d="M12 17h6.2"/>
                <path d="M12 14h8"/>
            </svg>
        ),
        url: '/home/settings/privacy'
    },
    {
        name: 'Blocked Users',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-hand-stop" width="24"
                 height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"
                 strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M8 13v-7.5a1.5 1.5 0 0 1 3 0v6.5"/>
                <path d="M11 5.5v-2a1.5 1.5 0 1 1 3 0v8.5"/>
                <path d="M14 5.5a1.5 1.5 0 0 1 3 0v6.5"/>
                <path
                    d="M17 7.5a1.5 1.5 0 0 1 3 0v8.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7a69.74 69.74 0 0 1 -.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47"/>
            </svg>
        ),
        url: '/home/settings/blockedUsers'
    },
    {
        name: 'Devices',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-device-desktop" width="24"
                 height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"
                 strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <rect x="3" y="4" width="18" height="12" rx="1"/>
                <line x1="7" y1="20" x2="17" y2="20"/>
                <line x1="9" y1="16" x2="9" y2="20"/>
                <line x1="15" y1="16" x2="15" y2="20"/>
            </svg>
        ),
        url: '/home/settings/devices'
    }
]