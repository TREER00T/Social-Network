let dotenv = require('dotenv'),
    {MongoClient} = require('mongodb');

dotenv.config();

module.exports = {

    createDatabase() {
        let client = new MongoClient(`mongodb://${process.env.HOST}:${process.env.MONGO_PORT}`),
            db = client.db(process.env.DATABASE);

        client.connect();

        db.listCollections({name: process.env.DATABASE}).next((err, isExist) => {

            if (!isExist)
                db.createCollection(process.env.MONGO_COLLECTION);

        });

        client.close();

    }

}