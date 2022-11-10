require('./app/io/connect/socket');
let Router = require('./app/middleware/RouterInterface'),
    Database = require('./app/database/DatabaseInterface');

main();

async function main() {

    await Router.initialization();
    await Database.initialization();

}

