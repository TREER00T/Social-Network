import {useState} from "react";
import {useCookies} from "react-cookie";
import {resApi} from "common/fetch";
import {Navigate} from "react-router-dom";
import ErrorHandler from "component/ErrorHandler";
import AccessAccount from "img/access-account.svg";
import EditText from "component/EditText";
import Button from "component/Button";
import {haveName} from "util/Utils";

function AddNameForProfile() {
    const [data, setData] = useState({});
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const haveFirstName = haveName(firstName);
    const [hasClicked, setHasClicked] = useState(false);
    const [cookies] = useCookies(['apiKey', 'phone']);

    const getFirstName = d => setFirstName(d),
        getLastName = d => setLastName(d),
        handleOpenDialog = () => setHasClicked(!hasClicked),
        response = async () => {
            let data = await resApi('auth/profile/name', {
                method: 'PUT',
                body: {
                    firstName: firstName,
                    ...(lastName ? {lastName: lastName} : {})
                }
            });
            setData(data);
            setHasClicked(!hasClicked);
        };

    return (
        <div>
            {cookies?.apiKey ? <Navigate to="/home"/> : <></>}
            {cookies?.phone ? <></> : <Navigate to="/user/login"/>}


            <ErrorHandler
                setCookie={{key: 'apiKey', value: data?.data?.apiKey}}
                errMsg={data?.message}
                visibility={hasClicked}
                handler={handleOpenDialog}
                statusCode={data?.statusCode}
                redirectTo="/home"/>


            <div className="flex flex-col items-center">

                <img src={AccessAccount} className="w-2/5 mx-auto sm:my-20 lg:w-1/5" alt="AccessAccount"/>
                <div className="w-2/6 text-center">
                    <EditText minLength={3} getText={getFirstName} label="First Name (Require)"/>
                    <EditText className="mt-5" getText={getLastName} label="Last Name (Optional)"/>
                    <Button className="mt-10" disabled={!haveFirstName} onClick={() => response()}>Save</Button>
                </div>
            </div>
        </div>
    );
}

export default AddNameForProfile;