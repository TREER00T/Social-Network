module.exports = {
    
        HTTP_CONTINUE : {
            code : 100,
            message : 'Continue'
        },
        HTTP_SWITCHING_PROTOCOLS : {
            code : 101,
            message : 'Switching Protocols'
        },
        HTTP_PROCESSING : {
            code : 102,
            message : 'Processing'
        },
        HTTP_EARLY_HINTS : {
            code : 103,
            message : 'Early Hints'
        },
        HTTP_OK : {
            code : 200,
            message : 'OK'
        },
        HTTP_CREATED : {
            code : 201,
            message : 'Created'
        },
        HTTP_ACCEPTED : {
            code : 202,
            message : 'Accepted'
        },
        HTTP_NON_AUTHORITATIVE_INFORMATION : {
            code : 203,
            message : 'Non-Authoritative Information'
        },
        HTTP_NO_CONTENT : {
            code : 204,
            message : 'No Content'
        },
        HTTP_RESET_CONTENT : {
            code : 205,
            message : 'Reset Content'
        },
        HTTP_PARTIAL_CONTENT : {
            code : 206,
            message : 'Partial Content'
        },
        HTTP_MULTI_STATUS : {
            code : 207,
            message : 'Multi-Status'
        },
        HTTP_ALREADY_REPORTED : {
            code : 208,
            message : 'Already Reported'
        },
        HTTP_IM_USED : {
            code : 226,
            message : 'IM Used'
        },
        HTTP_MULTIPLE_CHOICES : {
            code : 300,
            message : 'Multiple Choices'
        },
        HTTP_MOVED_PERMANENTLY : {
            code : 301,
            message : 'Moved Permanently'
        },
        HTTP_FOUND : {
            code : 302,
            message : 'Found'
        },
        HTTP_SEE_OTHER : {
            code : 303,
            message : 'See Other'
        },
        HTTP_NOT_MODIFIED : {
            code : 304,
            message : 'Not Modified'
        },
        HTTP_USE_PROXY : {
            code : 305,
            message : 'Use Proxy'
        },
        HTTP_TEMPORARY_REDIRECT : {
            code : 307,
            message : 'Temporary Redirect'
        },
        HTTP_PERMANENTLY_REDIRECT : {
            code : 308,
            message : 'Permanent Redirect'
        },
        HTTP_BAD_REQUEST : {
            code : 400,
            message : 'Bad Request'
        },
        HTTP_UNAUTHORIZED : {
            code : 401,
            message : 'Unauthorized'
        },
        HTTP_PAYMENT_REQUIRED : {
            code : 402,
            message : 'Payment Required'
        },
        HTTP_FORBIDDEN : {
            code : 403,
            message : 'Forbidden'
        },
        HTTP_NOT_FOUND : {
            code : 404,
            message : 'Not Found'
        },
        HTTP_METHOD_NOT_ALLOWED : {
            code : 405,
            message : 'Method Not Allowed'
        },
        HTTP_NOT_ACCEPTABLE : {
            code : 406,
            message : 'Not Acceptable'
        },
        HTTP_PROXY_AUTHENTICATION_REQUIRED : {
            code : 407,
            message : 'Proxy Authentication Required'
        },
        HTTP_REQUEST_TIMEOUT : {
            code : 408,
            message : 'Request Timeout'
        },
        HTTP_CONFLICT : {
            code : 409,
            message : 'Conflict'
        },
        HTTP_GONE : {
            code : 410,
            message : 'Gone'
        },
        HTTP_LENGTH_REQUIRED : {
            code : 411,
            message : 'Length Required'
        },
        HTTP_PRECONDITION_FAILED : {
            code : 412,
            message : 'Precondition Failed'
        },
        HTTP_REQUEST_ENTITY_TOO_LARGE : {
            code : 413,
            message : 'Content Too Large'
        },
        HTTP_REQUEST_URI_TOO_LONG : {
            code : 414,
            message : 'URI Too Long'
        },
        HTTP_UNSUPPORTED_MEDIA_TYPE : {
            code : 415,
            message : 'Unsupported Media Type'
        },
        HTTP_REQUESTED_RANGE_NOT_SATISFIABLE : {
            code : 416,
            message : 'Range Not Satisfiable'
        },
        HTTP_EXPECTATION_FAILED : {
            code : 417,
            message : 'Expectation Failed'
        },
        HTTP_I_AM_A_TEAPOT : {
            code : 418,
            message : 'I\'m a teapot'
        },
        HTTP_MISDIRECTED_REQUEST : {
            code : 421,
            message : 'Misdirected Request'
        },
        HTTP_UNPROCESSABLE_ENTITY : {
            code : 422,
            message : 'Unprocessable Content'
        },
        HTTP_LOCKED : {
            code : 423,
            message : 'Locked'
        },
        HTTP_FAILED_DEPENDENCY : {
            code : 424,
            message : 'Failed Dependency'
        },
        HTTP_TOO_EARLY : {
            code : 425,
            message : 'Too Early'
        },
        HTTP_UPGRADE_REQUIRED : {
            code : 426,
            message : 'Upgrade Required'
        },
        HTTP_PRECONDITION_REQUIRED : {
            code : 428,
            message : 'Precondition Required'
        },
        HTTP_TOO_MANY_REQUESTS : {
            code : 429,
            message : 'Too Many Requests'
        },
        HTTP_REQUEST_HEADER_FIELDS_TOO_LARGE : {
            code : 431,
            message : 'Request Header Fields Too Large'
        },
        HTTP_UNAVAILABLE_FOR_LEGAL_REASONS : {
            code : 451,
            message : 'Unavailable For Legal Reasons'
        },
        HTTP_INTERNAL_SERVER_ERROR : {
            code : 500,
            message : 'Internal Server Error'
        },
        HTTP_NOT_IMPLEMENTED : {
            code : 501,
            message : 'Not Implemented'
        },
        HTTP_BAD_GATEWAY : {
            code : 502,
            message :  'Bad Gateway'
        },
        HTTP_SERVICE_UNAVAILABLE : {
            code : 503,
            message : 'Service Unavailable'
        },
        HTTP_GATEWAY_TIMEOUT : {
            code : 504,
            message : 'Gateway Timeout'
        },
        HTTP_VERSION_NOT_SUPPORTED : {
            code : 505,
            message : 'HTTP Version Not Supported'
        },
        HTTP_VARIANT_ALSO_NEGOTIATES_EXPERIMENTAL : {
            code : 506,
            message : 'Variant Also Negotiates'
        },
        HTTP_INSUFFICIENT_STORAGE : {
            code : 507,
            message : 'Insufficient Storage'
        },
        HTTP_LOOP_DETECTED : {
            code : 508,
            message : 'Loop Detected'
        },
        HTTP_NOT_EXTENDED : {
            code : 510,
            message : 'Not Extended'
        },
        HTTP_NETWORK_AUTHENTICATION_REQUIRED : {
            code : 511,
            message : 'Network Authentication Required'
        },
        HTTP_UNAUTHORIZED_TOKEN_EXP : {
            code : 519,
            message : 'Unauthorized! Token was expired'
        },
        HTTP_UNAUTHORIZED_INVALID_TOKEN : {
            code : 800,
            message : 'Unauthorized! Token was invalid'
        }
  
};

