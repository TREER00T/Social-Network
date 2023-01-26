import Cookies from "universal-cookie";
import config from 'config';

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');
const apiKey = cookies.get('apiKey');
const getInStorage = key => localStorage.getItem(key);
const setInStorage = (key, value) => localStorage.setItem(key, value);

export async function resApi(endPoint, option) {

    let baseHeader = {
        'Content-type': option?.headers?.['Content-type'] ?? 'application/json; charset=UTF-8'
    }

    if (option?.body)
        option.body = JSON.stringify(option.body);

    if (accessToken)
        baseHeader.authorization = `Bearer ${getInStorage('accessToken')}`;

    if (apiKey)
        baseHeader.apiKey = getInStorage('apiKey');

    let orgHeader = option?.headers;

    if (option?.headers)
        delete option.headers;


    let responseOfRequest = async (endPoint) => await fetch(`${config.url.rest}${endPoint}`, {
        mode: 'cors',
        headers: orgHeader ? {
            ...baseHeader,
            ...orgHeader
        } : baseHeader,
        ...option
    }).then(res => res.json());

    let res = await responseOfRequest(endPoint);

    // token or api key was invalid or access token was expired
    if ([519, 800, 804].includes(res?.statusCode)) {
        option.headers.authorization = `Bearer ${getInStorage('refreshToken')}`;

        let firstRequestFailedMethod = option?.method ? option?.method : 'GET';
        option.method = 'POST';

        let refreshTokenResponse = await responseOfRequest('auth/user/refresh/token')
            .then(res => res.json());

        option.headers.authorization = refreshTokenResponse?.data?.accessToken;

        setInStorage('refreshToken', refreshTokenResponse?.data?.refreshToken);
        setInStorage('accessToken', option.headers.authorization);

        option.method = firstRequestFailedMethod;

        return responseOfRequest(endPoint);
    }

    return res;
}