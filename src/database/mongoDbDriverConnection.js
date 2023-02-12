require("dotenv").config();
let {MongoClient} = require("mongodb"),
    ObjectId = require("mongodb").ObjectId,
    client = new MongoClient(`mongodb://${process.env.HOST}:${process.env.MONGO_PORT}`),
    db = client.db(process.env.DATABASE);

module.exports = {

    async insertOne(obj, name) {

        return await db.collection(name.toLowerCase()).insertOne(obj);

    },

    async updateOne(obj, filter, name) {

        if (filter?._id)
            filter._id = new ObjectId(filter._id);

        await db.collection(name.toLowerCase()).updateOne(filter, {$set: obj}, {upsert: true});

    },

    async dropCollection(name) {

        db.listCollections({name: name.toLowerCase()}).next((err, isExist) => {

            if (isExist)
                db.collection(name.toLowerCase()).drop();
        });

    },

    createCollection(name) {

        db.listCollections({name: name.toLowerCase()}).next((err, isExist) => {

            if (!isExist)
                db.createCollection(name.toLowerCase());
        });

    },

    async deleteMany(filter, name) {

        if (filter?._id?.$in)
            filter?._id?.$in = filter?._id?.$in.map(e => new ObjectId(e));

        await db.collection(name.toLowerCase()).deleteMany(filter);

    },

    async countRows(name) {

        return await db.collection(name.toLowerCase()).countDocuments();

    },

    async findMany(filter, projection, name, toArray) {

        if (filter?._id && !filter?._id?.$in)
            filter.id = new ObjectId(filter._id);

        if (filter?._id && filter?._id?.$in)
            filter?._id?.$in = filter?._id?.$in.map(e => new ObjectId(e));

        let result;

        if (typeof projection === "string")
            result = await db.collection(projection.toLowerCase()).find(filter);

        if (typeof name === 'string')
            result = await db.collection(name.toLowerCase()).find(filter, {
                projection: projection
            });

        if (typeof filter === "string")
            result = await db.collection(filter.toLowerCase()).find();

        if (toArray || typeof name === 'boolean' || typeof projection === 'boolean')
            return result;
        else
            return result.toArray();

    },


    async findOne(filter, projection, name) {

        if (filter?._id)
            filter.id = new ObjectId(filter._id);

        let result;

        if (typeof projection === "string")
            result = await db.collection(projection.toLowerCase()).findOne(filter);

        if (typeof name === 'string')
            result = await db.collection(name.toLowerCase()).findOne(filter, {
                projection: projection
            });

        return result.toArray();
    },

    async haveCollection(name) {

        return new Promise(res => {

            db.listCollections({name: name.toLowerCase()}).next((err, isExist) => {

                res(isExist);

            });

        });

    }

};