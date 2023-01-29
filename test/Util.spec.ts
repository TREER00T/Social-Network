import Util from '../src/util/Util';

describe('validateMessage fn', () => {

    test('1', () => {
        expect(Util.validateMessage({
            text: 'Test',
            type: 'None',
            senderId: '1'
        })).toEqual({
            text: 'Test',
            type: 'None',
            senderId: '1',
            isReply: false,
            isForward: false
        });
    });

    test('2', () => {
        expect(Util.validateMessage({
            type: 'Image',
            senderId: '1'
        })).toEqual({
            type: 'Image',
            senderId: '1',
            isReply: false,
            isForward: false
        });
    });

    test('3', () => {
        expect(Util.validateMessage({
            type: 'Location',
            senderId: '1',
            locationLat: '1',
            locationLon: '2'
        })).toEqual({
            type: 'Location',
            senderId: '1',
            isReply: false,
            isForward: false,
            location: ['1', '2']
        });
    });

});