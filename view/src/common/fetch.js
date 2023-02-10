import Cookies from "universal-cookie";
import config from 'config';
import axios from "axios";

async function axiosReq(url, option) {
    const formData = new FormData();

    for (let d in option.body)
        formData.append(option.body[d].key, option.body[d].value);

    let data = await axios[option?.method ?? 'put'](url, formData);

    return {statusCode: data.status};
}

export async function resApi(endPoint, option) {

    let requestWith = option?.with;
    let query = option?.query;

    delete option?.with;
    delete option?.query;

    const cookies = new Cookies();
    const accessToken = cookies.get('accessToken');
    const apiKey = cookies.get('apiKey');
    const getInStorage = key => cookies.get(key);
    const setInStorage = (key, value) => cookies.set(key, value);

    let baseHeader = {
        'Content-type': option?.headers?.['Content-type'] ?? 'application/json'
    }

    if (option?.body && requestWith !== 'axios')
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


    let responseOfRequest = async (endPoint, refreshTokenRequest) => {

        let url = `${config.url.rest}${endPoint}`;

        if (requestWith === 'axios' && !refreshTokenRequest)
            return await axiosReq(url, option);

        if (query && !refreshTokenRequest) {
            let u = new URL(url);
            u.search = new URLSearchParams(query).toString();
            url = u.href;
        }

        return await fetch(url, {
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
    if (res.statusCode === 401) {
        axios.defaults.headers.authorization = `Bearer ${getInStorage('refreshToken')}`;
        baseHeader.authorization = `Bearer ${getInStorage('refreshToken')}`;

        let firstRequestFailedMethod = option?.method ? option?.method : 'GET';
        option['method'] = 'POST';

        let refreshTokenResponse = await responseOfRequest('auth/refresh/token', true);

        baseHeader.authorization = `Bearer ${refreshTokenResponse?.data?.accessToken}`;
        axios.defaults.headers.authorization = `Bearer ${refreshTokenResponse?.data?.accessToken}`;

        setInStorage('refreshToken', refreshTokenResponse?.data?.refreshToken);
        setInStorage('accessToken', baseHeader.authorization);

        option['method'] = firstRequestFailedMethod;

        return await responseOfRequest(endPoint);
    }

    return res;
}