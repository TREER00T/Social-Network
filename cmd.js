#!/usr/bin/env node
let {
        program
    } = require('commander'),
    File = require('./src/util/File');


program
    .command('serve')
    .description('Initialization server')
    .action(async () => {

        await File.mkdirForUploadFile();

    })
    .parse();