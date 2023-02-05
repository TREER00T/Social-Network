import Cookies from "universal-cookie";
import config from 'config';
import axios from "axios";

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');
const apiKey = cookies.get('apiKey');
const getInStorage = key => cookies.get(key);
const setInStorage = (key, value) => cookies.set(key, value);

async function uploadFile(endPoint, option) {
    const formData = new FormData();
    formData.append(option.name, option.file);
    let data = await axios[option?.method ?? 'put'](`${config.url.rest}${endPoint}`, formData);

    return {statusCode: data.status};
}

export async function resApi(endPoint, option) {

    let baseHeader = {
        'Content-type': option?.headers?.['Content-type'] ?? 'application/json'
    }

    if (option?.body && !option?.isFile)
        option.body = JSON.stringify(option.body);

    if (accessToken) {
        axios.defaults.headers.authorization = `Bearer ${getInStorage('accessToken')}`;
        baseHeader.authorization = `Bearer ${getInStorage('accessToken')}`;
    }

    if (apiKey) {
        axios.defaults.headers['x-api-key'] = getInStorage('apiKey');
        baseHeader['x-api-key'] = getInStorage('apiKey');
    }

    let orgHeader = option?.headers;

    if (option?.headers)
        delete option.headers;


    let responseOfRequest = async endPoint => {
        if (option?.isFile) {
            delete option.isFile;
            return await uploadFile(endPoint, option.body);
        }

        return await fetch(`${config.url.rest}${endPoint}`, {
            mode: 'cors',
            headers: orgHeader ? {
                ...baseHeader,
                ...orgHeader
            } : baseHeader,
            ...option
        }).then(res => res.json())
    };

    let res = await responseOfRequest(endPoint);

    // token or api key was invalid or access token was expired
    if ([519, 800, 804].includes(res?.statusCode)) {
        axios.defaults.headers.authorization = `Bearer ${getInStorage('refreshToken')}`;
        baseHeader.authorization = `Bearer ${getInStorage('refreshToken')}`;

        let firstRequestFailedMethod = option?.method ? option?.method : 'GET';
        option['method'] = 'POST';

        let refreshTokenResponse = await responseOfRequest('auth/refresh/token');

        baseHeader.authorization = `Bearer ${refreshTokenResponse?.data?.accessToken}`;
        axios.defaults.headers.authorization = `Bearer ${refreshTokenResponse?.data?.accessToken}`;

        setInStorage('refreshToken', refreshTokenResponse?.data?.refreshToken);
        setInStorage('accessToken', baseHeader.authorization);

        option['method'] = firstRequestFailedMethod;

        return await responseOfRequest(endPoint);
    }

    return res;
}