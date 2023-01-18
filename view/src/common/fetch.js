import Cookies from "universal-cookie";

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');
const refreshToken = cookies.get('refreshToken');
const apiKey = cookies.get('apiKey');

export async function resApi(url, option) {

    let baseHeader = {
        'Content-type': 'application/json; charset=UTF-8'
    }

    if (option?.body)
        option.body = JSON.stringify(option.body);

    if (accessToken)
        baseHeader.authorization = `Bearer ${accessToken}`;

    if (apiKey)
        baseHeader.apiKey = apiKey;

    let orgHeader = option?.headers;

    if (option?.headers)
        delete option.headers;


    let responseOfRequest = async (url) => await fetch(`http://localhost:3000/api/v1/${url}`, {
        mode: 'cors',
        headers: orgHeader ? {
            ...baseHeader,
            ...orgHeader
        } : baseHeader,
        ...option
    }).then(res => res.json());

    let res = await responseOfRequest(url);

    // token or api key was invalid or access token was expired
    if ([519, 800, 804].includes(res?.code)) {
        option.headers.authorization = `Bearer ${refreshToken}`;

        let firstRequestFailedMethod = option?.method ? option?.method : 'GET';
        option.method = 'POST';

        let refreshTokenResponse = await responseOfRequest('auth/user/refresh/token')
            .then(res => res.json());

        option.headers.authorization = refreshTokenResponse?.data?.accessToken;

        cookies.set('refreshToken', refreshTokenResponse?.data?.refreshToken);
        cookies.set('accessToken', option.headers.authorization);

        option.method = firstRequestFailedMethod;

        return responseOfRequest(url);
    }

    return res;
}