import PageNotFound from 'img/page-not-found.svg';
import React, { useEffect } from 'react';

export default function NotFound() {
    useEffect(() => {
        document.title = 'Not Found';
    }, []);

    return (
        <div className="flex w-2/4 mx-auto lg:mt-20 sm:mt-52">
            <img src={PageNotFound} alt="Page Not Found"/>
        </div>
    )
}