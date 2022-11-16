#!/usr/bin/env node
let {
        program
    } = require('commander'),
    Database = require('./app/database/config'),
    File = require('./app/util/File');


program
    .command('serve')
    .description('Initialization server')
    .action(async () => {

        await Database.createDatabase();

        await File.mkdirForUploadFile();

    })
    .parse();