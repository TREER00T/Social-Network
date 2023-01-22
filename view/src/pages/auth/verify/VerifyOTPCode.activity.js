import {useState} from "react";
import {useCookies} from "react-cookie";
import {resApi} from "common/fetch";
import {Navigate} from "react-router-dom";
import ErrorHandler from "component/ErrorHandler";
import AccessAccount from "img/access-account.svg";
import EditText from "component/EditText";
import Button from "component/Button";
import {getAuthExpirePayload} from "util/Utils";

function VerifyOTPCodeActivity() {
    const [otpCode, setOtpCode] = useState('');
    const [hasClicked, setHasClicked] = useState(false);
    const [cookies] = useCookies(['accessToken', 'phone']);
    const [data, setData] = useState({});
    const isOTPCode = /^(1[0-9]{5}|2[0-9]{5}|[3-9][0-9]{5}|[1-9][0-9]{6})$/.test(otpCode);

    const getText = (d) => {
        setOtpCode(d);
    }, handleOpenDialog = () => {
        setHasClicked(!hasClicked);
    }, response = async () => {
        let location = await fetch('https://get.geojs.io/v1/ip/geo.json');

        let data = await resApi('auth/verify/otp', {
            method: 'POST',
            body: {
                phone: cookies?.phone,
                code: otpCode,
                deviceLocation: `${location?.country} ${location?.longitude},${location?.latitude}`
            }
        });
        setData(data);
        setHasClicked(!hasClicked);
    };

    return (
        <div>
            {cookies?.accessToken ? <Navigate to="/home"/> : <></>}
            {cookies?.phone ? <></> : <Navigate to="/user/login"/>}

            {
                data?.statusCode === 209 ? <Navigate to="/user/login/verify/twoStep"/> :
                    <ErrorHandler
                        setCookie={getAuthExpirePayload(data?.data)}
                        errMsg={data?.message}
                        visibility={hasClicked}
                        handler={handleOpenDialog}
                        statusCode={data?.statusCode}
                        redirectTo="/home"/>
            }


            <div className="flex flex-col items-center">

                <img src={AccessAccount} className="w-2/5 mx-auto sm:my-20 lg:w-1/5" alt="AccessAccount"/>
                <div className="w-2/6 text-center">
                    <EditText maxLength={6} getText={getText} label="OTP Code"/>
                    {
                        isOTPCode ?
                            <Button className="mt-10" onClick={() => response()}>Verify Code</Button> :
                            <Button className="mt-10" disabled>Verify Code</Button>
                    }
                </div>
            </div>
        </div>
    );
}

export default VerifyOTPCodeActivity;