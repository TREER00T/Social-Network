import {useState} from 'react';
import DialogApiDocs from './DialogApiDocs';

function Navbar({className}) {
    const [isHome, setIsHome] = useState(false);
    const [isSource, setIsSource] = useState(false);

    const handleClickHome = () => {
        setIsHome(current => !current);
    }, handleClickSource = () => {
        setIsSource(current => !current);
    };

    return (
        <div className={className + ' navbar'}>
            <a className={(isHome || !isSource ? 'active-nav-item' : '') + ' text-blue-200'}
               onClick={handleClickHome}
               href="/">Home</a>
            <a className={(isSource ? 'active-nav-item' : '') + ' text-blue-200'} onClick={handleClickSource}
               href="https://github.com/TREER00T/Social-Network-Server">Source</a>
            <DialogApiDocs className=' text-blue-200'>API</DialogApiDocs>

        </div>
    );
}

export default Navbar;