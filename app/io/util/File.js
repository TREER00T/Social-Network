let fs = require('fs'),
    Util = require('app/util/Generate'),
    dotenv = require('dotenv'),
    {
        FileException
    } = require('app/exception/FileException');

dotenv.config();

module.exports = {


    decodeAndWriteFile(dataBinary, fileFormat, socket, docsFormat = '.pdf') {

        const PNG = '.png',
            MP4 = '.mp4',
            MP3 = '.mp3',
            IMAGE = 'Image',
            VIDEO = 'Video',
            VOICE = 'Voice',
            ROOT_PROJECT_FOLDER = '../',
            DOCUMENT = 'Document';


        let pathDir = 'cache/',
            url = `http://${process.env.IP}:${process.env.EXPRESS_PORT}`,
            randomFileName = Util.getFileHashName();


        if (fileFormat === IMAGE)
            pathDir += `img/${randomFileName + PNG}`;

        if (fileFormat === DOCUMENT)
            pathDir += `docs/${randomFileName + docsFormat}`;

        if (fileFormat === VIDEO)
            pathDir += `video/${randomFileName + MP4}`;

        if (fileFormat === VOICE)
            pathDir += `voice/${randomFileName + MP3}`;


        fs.writeFileSync(ROOT_PROJECT_FOLDER + pathDir, dataBinary);
        fs.readFile(ROOT_PROJECT_FOLDER + pathDir, function (error, data) {
            try {
                let dataBase64 = Buffer.from(data).toString('base64');
                socket.write(dataBase64);
                console.log('g')
            } catch (e) {
                FileException(e);
            }

        });

        return url + '/' + pathDir;
    }


}