#!/usr/bin/env node

const {
        program
    } = require('commander'),
    Database = require('app/database/DatabaseInterface');

program
    .command('db')
    .description('Create database and tables')
    .action(function () {
        Database.initialization();
        console.log('Exist');
    })
    .parse();