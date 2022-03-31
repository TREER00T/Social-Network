let Response = require('../app/Util/Response'),
    {checkHttpMethod} = require('../app/Util/Validation');

describe('init.js file test', () => {

    // Should be return HTTP_METHOD_NOT_ALLOWED json object
    test('Should be return http method not allowed', () => {

        expect(checkHttpMethod('VIEW')).toBe(Response.HTTP_METHOD_NOT_ALLOWED);
    });

})