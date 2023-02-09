import Cookies from "universal-cookie";

export function isSuccess(resCode) {
    // Validation http status code
    return [200, 201, 202].includes(resCode);
}

function setMonth(number) {
    const expireDate = new Date();
    expireDate.setMonth(expireDate.getMonth() + number);
    return expireDate;
}

function setYear(number) {
    const expireDate = new Date();
    expireDate.setFullYear(expireDate.getFullYear() + number);
    return expireDate;
}

function getRefreshTokenExpireTime() {
    return setMonth(2);
}

function getAccessTokenExpireTime() {
    return setMonth(1);
}

export function getExpireTime() {
    return setYear(1);
}

export function getAuthExpirePayload(data) {
    if (!data)
        return;

    let result = [
        {
            key: 'accessToken',
            value: data?.accessToken,
            option: {
                expires: getAccessTokenExpireTime()
            }
        },
        {
            key: 'refreshToken',
            value: data?.refreshToken,
            option: {
                expires: getRefreshTokenExpireTime()
            }
        }
    ];

    if (data?.apiKey)
        result.push({
            key: 'apiKey',
            value: data.apiKey,
            option: {
                expires: getExpireTime()
            }
        });

    return result;
}

export const handleStorage = cookie => {
    const cookies = new Cookies();

    if (cookie.value) {
        if (cookie.option)
            cookie.option.path = '/';

        cookies.set(cookie.key, cookie.value, cookie?.option ? cookie?.option : {
            expires: getExpireTime(),
            path: '/'
        });
    }
}

export function isPassword(password) {
    return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{6,}$/g.test(password);
}

export function haveName(name) {
    return /^(?!\s*$)([^\s]{3,}(\s+[^\s]+)*)$/.test(name);
}

export function isValidOTPCode(otpCode) {
    return /^(1[0-9]{5}|2[0-9]{5}|[3-9][0-9]{5}|[1-9][0-9]{6})$/.test(otpCode);
}

export function isValidPhoneNumber(phone) {
    return /(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g.test(phone);
}

export function isEmail(email) {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email);
}

export function url() {
    return window.location.pathname;
}

export function getRoomType() {
    let urlPath = url();
    return urlPath.split('/')[2]?.charAt(0)?.toUpperCase() + urlPath.split('/')[2]?.slice(1);
}

export function getRoomId() {
    let urlPath = url();
    return urlPath.split('/')[3];
}

export const assign = (o, t) => o ? o.map(d => Object.assign(d, {type: t})) : [];

export const dataComposition = data =>
    assign(data?.e2es, 'E2E')
        .concat(assign(data?.groups, 'Group'))
        .concat(assign(data?.channels, 'Channel'));