export function isSuccess(resCode) {
    // Validation http status code
    return [200, 201, 202].includes(resCode);
}

function getTokenExpireTime() {
    return new Date().getDate() + 1;
}

function getApiKeyExpireTime() {
    return new Date().getTime() + (10 * 365 * 24 * 60 * 60);
}

export function getExpireTime() {
    return new Date().getTime() + (10 * 365 * 24 * 60 * 60);
}

export function getAuthExpirePayload(data) {
    let result = [
        {
            key: 'accessToken',
            value: data?.accessToken,
            option: {
                expires: getTokenExpireTime()
            }
        },
        {
            key: 'refreshToken',
            value: data?.refreshToken,
            option: {
                expires: getTokenExpireTime()
            }
        }
    ];

    if (data?.apiKey)
        result.push({
            key: 'apiKey',
            value: data?.apiKey,
            option: {
                expires: getApiKeyExpireTime()
            }
        });

    return result;
}

export function isPassword(password) {
    return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{6,}$/g.test(password);
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