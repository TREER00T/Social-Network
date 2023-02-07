import {useState} from "react";
import {useCookies} from "react-cookie";
import {resApi} from "common/fetch";
import {Navigate} from "react-router-dom";
import ErrorHandler from "component/ErrorHandler";
import AccessAccount from "img/access-account.svg";
import EditText from "component/EditText";
import Button from "component/Button";
import {isValidOTPCode, handleStorage, getAuthExpirePayload} from "util/Utils";

function VerifyOTPCodeActivity() {
    const [data, setData] = useState({});
    const [otpCode, setOtpCode] = useState('');
    const isOTPCode = isValidOTPCode(otpCode);
    const [hasClicked, setHasClicked] = useState(false);
    const [cookies] = useCookies(['apiKey', 'phone']);

    const getText = d => setOtpCode(d),
        handleOpenDialog = () => setHasClicked(!hasClicked),
        response = async () => {
            let location = await (await fetch('https://get.geojs.io/v1/ip/geo.json')).json();

            let data = await resApi('auth/verify/otp', {
                method: 'POST',
                body: {
                    phone: cookies.phone,
                    code: otpCode,
                    deviceLocation: `${location?.country} ${location?.longitude},${location?.latitude}`
                }
            });

            if (data?.statusCode === 212)
                getAuthExpirePayload(data?.data).forEach(e => handleStorage(e));


            setData(data);
            setHasClicked(!hasClicked);
        };

    return (
        <div>
            {cookies?.apiKey ? <Navigate to="/home"/> : <></>}
            {cookies?.phone ? <></> : <Navigate to="/user/login"/>}

            {
                data?.statusCode === 209 ? <Navigate to="/user/login/verify/twoStep"/> :
                    data?.statusCode === 212 ? <Navigate to="/user/profile"/> :
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
                    <Button className="mt-10" disabled={!isOTPCode} onClick={() => response()}>Verify Code</Button>
                </div>
            </div>
        </div>
    );
}

export default VerifyOTPCodeActivity;