let fs = require('fs'),
    Generate = require('app/util/Generate'),
    Util = require('app/util/util'),
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
            jsonObject,
            url = `http://${process.env.IP}:${process.env.EXPRESS_PORT}`,
            randomFileName = Generate.getFileHashName();


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

                const byteSize = fs.statSync(ROOT_PROJECT_FOLDER + pathDir).size;
                const fileSize = Util.formatBytes(byteSize);
                jsonObject = {
                    fileSize: fileSize
                };

            } catch (e) {
                FileException(e);
            }

        });

        return jsonObject = {
            fullFilePath: url + '/' + pathDir
        };
    }


}