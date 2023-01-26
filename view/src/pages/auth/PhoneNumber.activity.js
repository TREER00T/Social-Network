import EditText from "component/EditText";
import {useState} from "react";
import {useCookies} from "react-cookie";
import {Navigate} from "react-router-dom";
import Button from "component/Button";
import AccessAccount from 'img/access-account.svg';
import {resApi} from 'common/fetch';
import ErrorHandler from "component/ErrorHandler";
import {isValidPhoneNumber} from "util/Utils";

function PhoneNumberActivity() {

    const [phone, setPhone] = useState('');
    const [cookies] = useCookies(['accessToken']);
    const [hasClicked, setHasClicked] = useState(false);
    const [data, setData] = useState({});
    const isPhoneNumber = isValidPhoneNumber(phone);

    const getText = (d) => {
        setPhone(d);
    }, handleOpenDialog = () => {
        setHasClicked(!hasClicked);
    }, response = async () => {
        let data = await resApi('auth/generate/user', {
            method: 'POST',
            body: {
                phone: phone
            }
        });
        setData(data);
        setHasClicked(!hasClicked);
    };

    return (
        <div>
            {cookies?.accessToken ? <Navigate to="/home"/> : <></>}

            <ErrorHandler
                redirectTo="/user/login/verify/otp"
                setCookie={{key: 'phone', value: true}}
                visibility={hasClicked}
                handler={handleOpenDialog}
                statusCode={data?.statusCode}/>

            <div className="flex flex-col items-center">

                <img src={AccessAccount} className="w-2/5 mx-auto sm:my-20 lg:w-1/5" alt="AccessAccount"/>
                <div className="w-2/6 text-center">
                    <EditText maxLength={16} getText={getText} label="Phone Number"/>
                    {
                        isPhoneNumber && !hasClicked ?
                            <Button className="mt-10" onClick={() => response()}>Send Code</Button> :
                            <Button className="mt-10" disabled>Send Code</Button>
                    }
                </div>
            </div>
        </div>
    );

}

export default PhoneNumberActivity;