const redis = require("redis");
const client = redis.createClient();
client.connect();

module.exports = {

    async set(key, value) {
        if (typeof value === "object")
            return await client.set(key, JSON.stringify(value));

        await client.set(key, value);
    },

    async get(key) {
        let data = await client.get(key);

        if (data?.indexOf('{"', 0))
            return JSON.parse(data);

        return data;
    },

    async remove(key) {
        await client.del(key);
    }

}