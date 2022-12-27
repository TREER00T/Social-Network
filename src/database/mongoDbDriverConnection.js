require("dotenv").config();
let { MongoClient } = require("mongodb"),
  client = new MongoClient(`mongodb://${process.env.HOST}:${process.env.MONGO_PORT}`),
  db = client.db(process.env.DATABASE);

module.exports = {

  async insertOne(obj, name) {

    return await db.collection(name).insertOne(obj);

  },

  async updateOne(obj, filter, name) {

    await db.collection(name).updateOne(filter, obj);

  },

  async dropCollection(name) {

    db.listCollections({ name: name }).next((err, isExist) => {

      if (isExist)
        db.collection(name).drop();
    });

  },

  createCollection(name) {

    db.listCollections({ name: name }).next((err, isExist) => {

      if (!isExist)
        db.createCollection(name);
    });

  },

  async deleteMany(filter, name) {

    await db.collection(name).deleteMany(filter);

  },

  async countRows(name) {

    return await db.collection(name).countDocuments();

  },

  async findMany(filter, projection, name) {

    let result;

    if (typeof projection === "string")
      result = await db.collection(projection).find(filter);

    else
      result = await db.collection(name).find(filter, projection);

    if (typeof filter === "string")
      result = await db.collection(filter).find();

    return result;

  },

  async haveCollection(name) {

    return new Promise(res => {

      db.listCollections({ name: name }).next((err, isExist) => {

        res(isExist);

      });

    });

  }

};