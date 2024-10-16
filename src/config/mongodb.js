
import { MongoClient } from "mongodb";
import { ApplicationError } from "../error-handler/applicationError.js";


var client;
export const connectToMongoDB = () => {
    MongoClient.connect(process.env.DB_URL).
        then(clientInstance => {
            client = clientInstance;
            createCounter(client.db());
            createIndex(client.db());
            console.log("MongoDb is Connected");
        })
        .catch(err => {
            console.log(err);
        })
}
export const getClient = () => {
    return client
}
export const getDB = () => {
    return client.db();
}

const createCounter = async (db) => {
    const existingCounter = await db.collection("counters").findOne({ _id: "cartItemId" });
    if (!existingCounter) {
        await db.collection("counters").insertOne({ _id: "cartItemId", value: 0 });
    }
}

const createIndex = async (db) => {
    try {
        await db.collection("products").createIndex({ price: 1 })
        await db.collection("products").createIndex({ name: 1, category: -1 })
        await db.collection("products").createIndex({ desc: 'text' })
        console.log("index is created")
    } catch (err) {
        console.log(err)
        throw new ApplicationError("Something went wrong in createIndex")
    }
}