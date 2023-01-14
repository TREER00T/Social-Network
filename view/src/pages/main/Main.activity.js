import Preview from 'img/preview.svg';
import Community from 'img/Community.svg';
import {Link} from 'react-router-dom';
import Navbar from "pages/main/Navbar";

function MainActivity() {

    return (
        <div className="vertical">
            <Navbar className="glass-tem"/>
            <div className="grid m-20">
                <div className="preview-background bg-blue-200"/>
                <span className="text-white mt-5 text-5xl text-center">Social Network</span>
                <span className="text-white m-3 text-2xl text-center">A simple chat application</span>
                <img src={Preview} className="w-30" alt="Preview"/>
            </div>

            <div className="flex place-content-center mb-10">
                <div className="flex flex-col items-center justify-center">
                    <span className="text-5xl text-orange-500 font-bold">Let's go</span>
                    <span className="text-xl text-gray-600">to use app</span>
                    <Link className="text-lg mt-20 text-white bg-transparent hover:bg-blue-100 text-blue-700 font-semibold
                     hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                          to="/user/login">
                        Login
                    </Link>
                </div>
                <img src={Community} className="w-2/5 sm:ml-32 lg:ml-52" alt="Community"/>
            </div>
        </div>
    );

}

export default MainActivity;