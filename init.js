require('./app/io/connect/socket');
let Router = require('./app/middleware/RouterInterface'),
    Database = require('./app/database/config');

main();

async function main() {

    await Router.initialization();

    await Database.createDatabase();

}

