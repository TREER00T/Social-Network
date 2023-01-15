import {Navigate} from "react-router-dom";
import {getExpireTime, isSuccess} from "util/Utils";
import DialogException from "component/DialogException";
import {useCookies} from 'react-cookie';

function ErrorHandler({redirectTo, statusCode, errMsg, setCookie}) {
    const [, setCookies] = useCookies(['']);

    if (statusCode && isSuccess(statusCode) && setCookie) {
        if (typeof setCookie !== 'object')
            setCookie.forEach(cookie => setCookies(cookie.key, cookie.value, cookie?.option ? cookie?.option : {
                expires: getExpireTime()
            }));
        else
            setCookie(setCookie.key, setCookie.value, setCookie?.option ? setCookie?.option : {
                maxAge: getExpireTime()
            });
    }

    return (
        <>
            {
                statusCode && isSuccess(statusCode) ?
                    <Navigate to={redirectTo}/> :
                    statusCode ? <DialogException children={errMsg}/> : <></>
            }
        </>
    )
}

export default ErrorHandler