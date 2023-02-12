import { useState } from 'react';

const ContextMenu = ({ items }) => {
    return (
        <div style={{ position: 'fixed', backgroundColor: 'white', padding: '10px' }}>
            {items.map((item, index) => (
                <div key={index} onClick={item.onClick} style={{ cursor: 'pointer' }}>
                    {item.label}
                </div>
            ))}
        </div>
    );
};

const Example = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleContextMenu = (event) => {
        event.preventDefault();
        setMousePosition({ x: event.clientX, y: event.clientY });
        setShowMenu(true);
    };

    const handleClick = () => {
        setShowMenu(false);
    };

    const items = [
        { label: 'Item 1', onClick: handleClick },
        { label: 'Item 2', onClick: handleClick },
        { label: 'Item 3', onClick: handleClick },
    ];

    return (
        <div onContextMenu={handleContextMenu} style={{ width: '100vw', height: '100vh' }}>
            {showMenu && (
                <ContextMenu
                    items={items}
                    onClose={() => {
                        setShowMenu(false);
                    }}
                    position={{ x: mousePosition.x, y: mousePosition.y }}
                />
            )}
        </div>
    );
};

export default Example;