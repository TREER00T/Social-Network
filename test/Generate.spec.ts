import Generate from '../src/util/Generate';
import Validation from '../src/util/Validation';

describe('Generate module', () => {

    let token = Generate.getJwtSign({
            phoneNumber: '09000000000',
            expiresIn: '12h',
            type: 'at'
        }, '09000000000'),
        encryptToken = Generate.getJwtEncrypt(token);


    it('should be verify jwt payload', async () => {
        expect(await Validation.getJwtVerify(token)).toMatchObject({
            phoneNumber: '09000000000',
            expiresIn: '12h',
            type: 'at'
        });

    });

    it('should be decrypt and verify jwt token', async () => {

        expect(await Validation.getJwtDecrypt(await encryptToken)).toBe(token);

    });

});