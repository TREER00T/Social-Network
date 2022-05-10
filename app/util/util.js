module.exports = {

    formatBytes(realSize) {

        const decimalLength = 2,
            packetSize = 1024;

        let d = Math.floor(Math.log(realSize) / Math.log(packetSize));

        return 0 === realSize ? '0 Bytes' :
            parseFloat((realSize / Math.pow(packetSize, d)).toFixed(Math.max(0, decimalLength))) +
            ' ' + ['Bytes', 'KB', 'MB', 'GB'][d];

    }

}