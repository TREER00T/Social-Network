let File = require('../../../app/util/File');

let simpleImageBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAAflBMVEX/3wAAAAD/5AD53gDAqwAyKwD/' +
    '4QD/5wD/6QAsJQCRfwD/6wD83wD32wBPRQCikACUhABnWQBfUwDNtgAdGQDIsQDx1wAmIACDdwAZFQDn' +
    'zgDhyABaTwCEdADbwQA+NwA4MAC3ogCqlQBGPAASDAByYwCxmwB4aQDSvgAUEQC8B6D2AAADh0lEQVRo' +
    'ge2Za3OqMBCGTaSbyEVQFBWKitZL//8fPFAvWSCJUGJnzkzeGT80pPu4JNnsrqORlZWVlZWVlZWVlZWV' +
    'lZWVlZWVlZWVlZWVVV8BUEpZ+QEwa5cKtS2XT/3MCSM3OjiZL5vxa+74uJrc9eXQxkNOixkRmp99bgoN' +
    '4w9huAGmfkSacsdUYckc2IsXLS4hi6X3ZjA/SLCVQv5WMFNxSzJ7I5guldzWXjAJhmSiAZN0+N5WgJmr' +
    '45K5P5gsB0Oy0oLJ9k1gWmDKKnKWRbQXA6dg+CLLwd4ccdf3gHq+/72ImYHwJQWDvxODM++GAX7b6LmZ' +
    '2CUHpyhmXZ/u8ZCQoxF3leAtWuBAgNinsVCtAF/F2ASdHPDN3YtycCbGNjhYGEwFFGuMjvHZyJ3QERyg' +
    'Q0tSU8v6GjzyPhGYxJ7ZbEsDZiEGk0vGjXutiNVZDUy+LluTiZ4aPKIz0tDcGRsKHXrwtQkmZBcGRtNb' +
    'eQbC1m0y+YoCY16rwAA7CZmQCN6d3kKgSH4KM4dLnd7W7kasTwNpgDahB8jl5NX2fVnm7RldKpyO35X6' +
    'PESDUJ71DfdZDx4BS6TofTJ0h70AV2i/2LfJ+dDL8iW4WmovbkVQkg10uQO4muWlzdJiqMvdwNUbD+ro' +
    'ycCWSFdwhc5qa339K3B5uJIjAhfDTpQ2gLTI+LKM+pfn2KAmVtP2WaXTIburZhDGCzmYBut2/c1R9L70' +
    'BNMykcvQvRugtydCMOVVbThtZhwYfOoFBi8uI+BRGMRl0tPDctZtAdaNhIOi3ZX3WGPg6ennn0THqNZz' +
    'uNVnwLNnoHJrZIY7MofuYOqH34/VvLcGabYRpvY/bxoS/F1mybOJCHyLO27LzucYYnS7hgFnjNMtPpm3' +
    'lwcxwVqFKeWMUlbeU99ofNP5fqqtZuneJQzXtUrlsal5fZR8z9fnoohm9Rxs3n1veVOi133RIH0xD3/L' +
    'Ti5nelPuwwdWvOZO+wRMr90FxhI9B0/fXqvUL/fhJ42pAh0P/op87heowW9nEg/VQ6+md1upd/8WfEWq' +
    'TPJGdGSxJNF6+tu/eAN63shMHVqmaKDaEdPsV/1qmuYt9CmT/QDDU/dDgnV+W7aVBg9TEfs2uyhT/LQC' +
    'PFjmHyhclXOvdEDiAYwnsRO6rhs6cco1JS+U0TL9mZq7BydO2ODyGKAMvqU6/Hz2mNplrpWV1f+qf0av' +
    'LKCFtScKAAAAAElFTkSuQmCC';

describe('Validation module', () => {

    it('should be return object with file size and url', async () => {

        expect(await File.validationAndWriteFile({
            format: '.png',
            size: 1095,
            dataBinary: Buffer.from(simpleImageBase64, 'base64')
        })).toMatchObject({
            size: "1.07 KB"
        });

    });

    it('should be make directory if isn\'t exist', async () => {
        expect(await File.mkdirForUploadFile()).toBe(true);
    });

});