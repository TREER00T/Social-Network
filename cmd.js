#!/usr/bin/env node

const {
        program
    } = require('commander'),
    DB = require('app/database/DatabaseConnection')
    Database = require('app/database/DatabaseInterface');

DB.connect();

program
    .command('db')
    .description('Create database and tables')
    .action(function () {
        Database.initialization();
        console.log('Exist');
    })
    .parse();