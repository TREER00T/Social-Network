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
    const [cookies] = useCookies(['accessToken', 'phone']);
    const [data, setData] = useState({});
    const isOTPCode = /^[0-9]{6,6}$/g.test(otpCode);

    const getText = (d) => {
        setOtpCode(d);
    }, response = async () => {
        let data = await resApi('auth/verify/otp', {
            method: 'POST',
            body: {
                phone: cookies?.phone,
                code: otpCode
            }
        });
        setData(data);
    };

    return (
        <div>
            {cookies?.accessToken ? <Navigate to="/home"/> : <></>}

            {
                data?.code === 209 ? <Navigate to="/user/login/verify/twoStep"/> :
                    <ErrorHandler
                        setCookie={getAuthExpirePayload(data?.data)}
                        statusCode={data?.code}
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