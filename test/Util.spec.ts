import Util from '../src/util/Util';

describe('validateMessage fn', () => {

    test('1', () => {
        expect(Util.validateMessage({
            text: 'Test',
            type: 'None'
        })).toEqual({
            text: 'Test',
            type: 'None',
            isReply: false,
            isForward: false
        });
    });

    test('2', () => {
        expect(Util.validateMessage({
            type: 'Image'
        })).toEqual({
            type: 'Image',
            isReply: false,
            isForward: false
        });
    });

    test('3', () => {
        expect(Util.validateMessage({
            type: 'Location',
            locationLat: '1',
            locationLon: '2'
        })).toEqual({
            type: 'Location',
            isReply: false,
            isForward: false,
            location: ['1', '2']
        });
    });

});