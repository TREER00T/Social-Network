export default {

    HTTP_CONTINUE: {
        statusCode: 100,
        message: 'Continue'
    },
    HTTP_SWITCHING_PROTOCOLS: {
        statusCode: 101,
        message: 'Switching Protocols'
    },
    HTTP_PROCESSING: {
        statusCode: 102,
        message: 'Processing'
    },
    HTTP_EARLY_HINTS: {
        statusCode: 103,
        message: 'Early Hints'
    },
    HTTP_OK: {
        statusCode: 200,
        message: 'OK'
    },
    HTTP_CREATED: {
        statusCode: 201,
        message: 'Created'
    },
    HTTP_ACCEPTED: {
        statusCode: 202,
        message: 'Accepted'
    },
    HTTP_NON_AUTHORITATIVE_INFORMATION: {
        statusCode: 203,
        message: 'Non-Authoritative Information'
    },
    HTTP_NO_CONTENT: {
        statusCode: 204,
        message: 'No Content'
    },
    HTTP_RESET_CONTENT: {
        statusCode: 205,
        message: 'Reset Content'
    },
    HTTP_PARTIAL_CONTENT: {
        statusCode: 206,
        message: 'Partial Content'
    },
    HTTP_MULTI_STATUS: {
        statusCode: 207,
        message: 'Multi-Status'
    },
    HTTP_ALREADY_REPORTED: {
        statusCode: 208,
        message: 'Already Reported'
    },
    HTTP_OK_BUT_TWO_STEP_VERIFICATION: {
        statusCode: 209,
        message: 'OK , But you need to two step verification'
    },
    HTTP_OK_BUT_ME_BLOCKED_BY_TARGET_USER_ID: {
        statusCode: 210,
        message: 'OK , But me blocked by target user id'
    },
    HTTP_OK_BUT_TARGET_USER_ID_BLOCKED_BY_ME: {
        statusCode: 211,
        message: 'OK , But target user id blocked by me'
    },
    HTTP_IM_USED: {
        statusCode: 226,
        message: 'IM Used'
    },
    HTTP_MULTIPLE_CHOICES: {
        statusCode: 300,
        message: 'Multiple Choices'
    },
    HTTP_MOVED_PERMANENTLY: {
        statusCode: 301,
        message: 'Moved Permanently'
    },
    HTTP_FOUND: {
        statusCode: 302,
        message: 'Found'
    },
    HTTP_SEE_OTHER: {
        statusCode: 303,
        message: 'See Other'
    },
    HTTP_NOT_MODIFIED: {
        statusCode: 304,
        message: 'Not Modified'
    },
    HTTP_USE_PROXY: {
        statusCode: 305,
        message: 'Use Proxy'
    },
    HTTP_TEMPORARY_REDIRECT: {
        statusCode: 307,
        message: 'Temporary Redirect'
    },
    HTTP_PERMANENTLY_REDIRECT: {
        statusCode: 308,
        message: 'Permanent Redirect'
    },
    HTTP_BAD_REQUEST: {
        statusCode: 400,
        message: 'Bad Request'
    },
    HTTP_UNAUTHORIZED: {
        statusCode: 401,
        message: 'Unauthorized'
    },
    HTTP_PAYMENT_REQUIRED: {
        statusCode: 402,
        message: 'Payment Required'
    },
    HTTP_FORBIDDEN: {
        statusCode: 403,
        message: 'Forbidden'
    },
    HTTP_NOT_FOUND: {
        statusCode: 404,
        message: 'Not Found'
    },
    HTTP_METHOD_NOT_ALLOWED: {
        statusCode: 405,
        message: 'Method Not Allowed'
    },
    HTTP_NOT_ACCEPTABLE: {
        statusCode: 406,
        message: 'Not Acceptable'
    },
    HTTP_PROXY_AUTHENTICATION_REQUIRED: {
        statusCode: 407,
        message: 'Proxy Authentication Required'
    },
    HTTP_REQUEST_TIMEOUT: {
        statusCode: 408,
        message: 'Request Timeout'
    },
    HTTP_CONFLICT: {
        statusCode: 409,
        message: 'Conflict'
    },
    HTTP_GONE: {
        statusCode: 410,
        message: 'Gone'
    },
    HTTP_LENGTH_REQUIRED: {
        statusCode: 411,
        message: 'Length Required'
    },
    HTTP_PRECONDITION_FAILED: {
        statusCode: 412,
        message: 'Precondition Failed'
    },
    HTTP_REQUEST_ENTITY_TOO_LARGE: {
        statusCode: 413,
        message: 'Content Too Large'
    },
    HTTP_REQUEST_URI_TOO_LONG: {
        statusCode: 414,
        message: 'URI Too Long'
    },
    HTTP_UNSUPPORTED_MEDIA_TYPE: {
        statusCode: 415,
        message: 'Unsupported Media Type'
    },
    HTTP_REQUESTED_RANGE_NOT_SATISFIABLE: {
        statusCode: 416,
        message: 'Range Not Satisfiable'
    },
    HTTP_EXPECTATION_FAILED: {
        statusCode: 417,
        message: 'Expectation Failed'
    },
    HTTP_I_AM_A_TEAPOT: {
        statusCode: 418,
        message: 'I\'m a teapot'
    },
    HTTP_MISDIRECTED_REQUEST: {
        statusCode: 421,
        message: 'Misdirected Request'
    },
    HTTP_UNPROCESSABLE_ENTITY: {
        statusCode: 422,
        message: 'Unprocessable Content'
    },
    HTTP_LOCKED: {
        statusCode: 423,
        message: 'Locked'
    },
    HTTP_FAILED_DEPENDENCY: {
        statusCode: 424,
        message: 'Failed Dependency'
    },
    HTTP_TOO_EARLY: {
        statusCode: 425,
        message: 'Too Early'
    },
    HTTP_UPGRADE_REQUIRED: {
        statusCode: 426,
        message: 'Upgrade Required'
    },
    HTTP_PRECONDITION_REQUIRED: {
        statusCode: 428,
        message: 'Precondition Required'
    },
    HTTP_TOO_MANY_REQUESTS: {
        statusCode: 429,
        message: 'Too Many Requests'
    },
    HTTP_REQUEST_HEADER_FIELDS_TOO_LARGE: {
        statusCode: 431,
        message: 'Request Header Fields Too Large'
    },
    HTTP_UNAVAILABLE_FOR_LEGAL_REASONS: {
        statusCode: 451,
        message: 'Unavailable For Legal Reasons'
    },
    HTTP_INTERNAL_SERVER_ERROR: {
        statusCode: 500,
        message: 'Internal Server Error'
    },
    HTTP_NOT_IMPLEMENTED: {
        statusCode: 501,
        message: 'Not Implemented'
    },
    HTTP_BAD_GATEWAY: {
        statusCode: 502,
        message: 'Bad Gateway'
    },
    HTTP_SERVICE_UNAVAILABLE: {
        statusCode: 503,
        message: 'Service Unavailable'
    },
    HTTP_GATEWAY_TIMEOUT: {
        statusCode: 504,
        message: 'Gateway Timeout'
    },
    HTTP_VERSION_NOT_SUPPORTED: {
        statusCode: 505,
        message: 'HTTP Version Not Supported'
    },
    HTTP_VARIANT_ALSO_NEGOTIATES_EXPERIMENTAL: {
        statusCode: 506,
        message: 'Variant Also Negotiates'
    },
    HTTP_INSUFFICIENT_STORAGE: {
        statusCode: 507,
        message: 'Insufficient Storage'
    },
    HTTP_LOOP_DETECTED: {
        statusCode: 508,
        message: 'Loop Detected'
    },
    HTTP_NOT_EXTENDED: {
        statusCode: 510,
        message: 'Not Extended'
    },
    HTTP_NETWORK_AUTHENTICATION_REQUIRED: {
        statusCode: 511,
        message: 'Network Authentication Required'
    },
    HTTP_UNAUTHORIZED_TOKEN_EXP: {
        statusCode: 519,
        message: 'Unauthorized! Token was expired'
    },
    HTTP_UNAUTHORIZED_INVALID_TOKEN: {
        statusCode: 800,
        message: 'Unauthorized! Token was invalid'
    },
    HTTP_TOKEN_OR_API_KEY_WAS_NOT_FOUND: {
        statusCode: 801,
        message: 'Token Or Api-Key was not found!'
    },
    HTTP_INVALID_JSON_OBJECT_KEY: {
        statusCode: 802,
        message: 'In valid json object key'
    },
    HTTP_USER_NOT_FOUND: {
        statusCode: 803,
        message: 'User Not Found'
    },
    HTTP_UNAUTHORIZED_INVALID_API_KEY: {
        statusCode: 804,
        message: 'Unauthorized! Invalid Api Key'
    }

};

