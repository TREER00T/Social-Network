module.exports = {

    formatBytes(realSize) {

        const decimalLength = 2,
            packetSize = 1024;

        let d = Math.floor(Math.log(realSize) / Math.log(packetSize));

        return 0 === realSize ? '0 Bytes' :
            parseFloat((realSize / Math.pow(packetSize, d)).toFixed(Math.max(0, decimalLength))) +
            ' ' + ['Bytes', 'KB', 'MB', 'GB'][d];

    },


    getRandomHexColor() {

        let letters = '0123456789ABCDEF'.split(''),
            color = '#';

        for (let i = 0; i < 6; i++) {
            color += letters[Math.round(Math.random() * 15)];
        }

        return color;
    },

    getFileFormat(fileName){
        return fileName.match(/\.[0-9a-z]+$/i)[0].toLowerCase();
    }

}