import {useState} from "react";
import {useCookies} from "react-cookie";
import {resApi} from "common/fetch";
import {Navigate} from "react-router-dom";
import ErrorHandler from "component/ErrorHandler";
import AccessAccount from "img/access-account.svg";
import EditText from "component/EditText";
import Button from "component/Button";
import {isPassword, handleStorage, getAuthExpirePayload} from "util/Utils";

function VerifyPasswordActivity() {

    const [password, setPassword] = useState('');
    const isValidPassword = isPassword(password);
    const [data, setData] = useState({});
    const [cookies] = useCookies(['apiKey', 'phone']);
    const [hasClicked, setHasClicked] = useState(false);

    const getText = d => setPassword(d),
        handleOpenDialog = () => setHasClicked(!hasClicked),
        response = async () => {
            let location = await (await fetch('https://get.geojs.io/v1/ip/geo.json')).json();

            let data = await resApi('auth/verify/twoStep', {
                method: 'POST',
                body: {
                    password: password,
                    deviceLocation: `${location?.country} ${location?.longitude},${location?.latitude}`
                }
            });

            if (data?.statusCode === 212)
                getAuthExpirePayload(data?.data).forEach(e => handleStorage(e));

            setData(data);
        };

    return (
        <div>
            {cookies?.apiKey ? <Navigate to="/home"/> : <></>}
            {cookies?.phone ? <></> : <Navigate to="/user/login"/>}

            {
                data?.statusCode === 212 ? <Navigate to="/user/profile"/> :
                    <ErrorHandler
                        setCookie={getAuthExpirePayload(data?.data)}
                        statusCode={data?.statusCode}
                        errMsg={data?.message}
                        visibility={hasClicked}
                        handler={handleOpenDialog}
                        redirectTo="/home"/>
            }

            <div className="flex flex-col items-center">

                <img src={AccessAccount} className="w-2/5 mx-auto sm:my-20 lg:w-1/5" alt="AccessAccount"/>
                <div className="w-2/6 text-center">
                    <EditText minLength={6} getText={getText} label="Verify Password"/>
                    <Button className="mt-10"
                            disabled={!isValidPassword}
                            onClick={() => response()}>Verify Password</Button>
                </div>
            </div>
        </div>
    );

}

export default VerifyPasswordActivity;