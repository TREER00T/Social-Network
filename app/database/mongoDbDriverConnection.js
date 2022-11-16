require('dotenv').config();
let {MongoClient} = require('mongodb'),
    client = new MongoClient(`mongodb://${process.env.HOST}:${process.env.MONGO_PORT}`),
    db = client.db(process.env.DATABASE);

client.connect();

module.exports = {

    async insertOne(obj, name) {

        let result = await db.collection(name).insertOne(obj);

        client.close();

        return result;
    },

    async updateOne(obj, filter, name) {

        await db.collection(name).updateOne(filter, obj);

        client.close();

    },

    async dropCollection(name) {

        await db.collection(name).drop();

        client.close();

    },

    createCollection(name) {

        db.listCollections({name: name}).next((err, isExist) => {

            if (!isExist)
                db.createCollection(name);
        });

        client.close();

    },

    async deleteMany(filter, name) {

        await db.collection(name).deleteMany(filter);

        client.close();

    },

    async countRows(name) {

        let count = await db.collection(name).countDocuments();

        client.close();

        return count;

    },

    async findMany(filter, projection, name) {

        let result;

        if (typeof projection === 'string')
            result = await db.collection(projection).find(filter);

        else
            result = await db.collection(name).find(filter, projection);

        if (typeof filter === 'string')
            result = await db.collection(filter).find();

        client.close();

        return result;

    },

    async haveCollection(name) {

        return new Promise(res => {

            db.listCollections({name: name}).next((err, isExist) => {

                res(isExist);

            });

            client.close();

        });

    }

}