import {useState} from "react";
import {useCookies} from "react-cookie";
import {resApi} from "common/fetch";
import {Navigate} from "react-router-dom";
import ErrorHandler from "component/ErrorHandler";
import AccessAccount from "img/access-account.svg";
import EditText from "component/EditText";
import Button from "component/Button";
import {getAuthExpirePayload} from "util/Utils";

function VerifyPasswordActivity() {

    const [password, setPassword] = useState('');
    const [cookies] = useCookies(['accessToken', 'phone']);
    const [data, setData] = useState({});
    const isValidPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{6,}$/g.test(password);

    const getText = (d) => {
        setPassword(d);
    }, response = async () => {
        let location = await fetch('https://get.geojs.io/v1/ip/geo.json');

        let data = await resApi('auth/verify/twoStep', {
            method: 'POST',
            body: {
                password: password,
                deviceLocation: `${location?.country} ${location?.longitude},${location?.latitude}`
            }
        });

        setData(data);
    };

    return (
        <div>
            {cookies?.accessToken ? <Navigate to="/home"/> : <></>}
            {cookies?.phone ? <></> : <Navigate to="/user/login"/>}

            <ErrorHandler
                setCookie={getAuthExpirePayload(data?.data)}
                statusCode={data?.code}
                errMsg={data?.message}
                redirectTo="/home"/>

            <div className="flex flex-col items-center">

                <img src={AccessAccount} className="w-2/5 mx-auto sm:my-20 lg:w-1/5" alt="AccessAccount"/>
                <div className="w-2/6 text-center">
                    <EditText minLength={6} getText={getText} label="Verify Password"/>
                    {
                        isValidPassword ?
                            <Button className="mt-10" onClick={() => response()}>Verify Password</Button> :
                            <Button className="mt-10" disabled>Verify Password</Button>
                    }
                </div>
            </div>
        </div>
    );

}

export default VerifyPasswordActivity;