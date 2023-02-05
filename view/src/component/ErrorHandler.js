import {Navigate} from "react-router-dom";
import {isSuccess} from "util/Utils";
import DialogException from "component/DialogException";
import {useEffect} from "react";
import {useCookies} from "react-cookie";
import {getExpireTime} from "util/Utils";

function ErrorHandler({redirectTo, statusCode, errMsg, setCookie, visibility, handler}) {
    const [, setCookies] = useCookies(['']);
    const handleStorage = cookie => {
        if (cookie.value) {
            if (cookie.option)
                cookie.option.path = '/';

            setCookies(cookie.key, cookie.value, cookie?.option ? cookie?.option : {
                expires: getExpireTime(),
                path: '/'
            });
        }
    }

    useEffect(() => {

        if (statusCode && isSuccess(statusCode)) {

            if (setCookie && Array.isArray(setCookie))
                setCookie.forEach(cookie => {
                    handleStorage(cookie);
                });

            if (setCookie && typeof setCookie === 'object')
                handleStorage(setCookie);

        }

    });


    return (
        statusCode && isSuccess(statusCode) ?
            <Navigate to={redirectTo}/> :
            statusCode ? <DialogException children={errMsg} visibility={visibility} handler={handler}/> : <></>
    )
}

export default ErrorHandler