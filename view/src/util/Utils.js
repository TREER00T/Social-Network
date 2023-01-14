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