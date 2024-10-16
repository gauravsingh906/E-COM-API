import { ObjectId, ReturnDocument } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

class CartItemRepository {
    constructor() {
        this.collection = "cartItems";
    }
    async add(productId, userId, quantity) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            const id = await this.getNextCounter(db);
            console.log(id, "id");

            // Find the document and either insert or update
            const result = await collection.updateOne(
                { productId: new ObjectId(productId), userId: new ObjectId(userId) },
                {
                    $setOnInsert: { _id: id },    // This will set the _id if the document is inserted
                    $set: { quantity: quantity }  // Increment the quantity
                },
                { upsert: true }  // If the document does not exist, insert it
            );

            return result;
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong in addCart");
        }
    }


    async get(userId) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            const result = await collection
                .find({ userId: new ObjectId(userId) })
                .toArray();
            console.log(result);
            return result;
        }
        catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong in getCart");
        }
    }
    async delete(cartItemId, userId) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);

            const result = await collection.deleteOne({ _id: new ObjectId(cartItemId), userId: new ObjectId(userId) });
            return result.deletedCount > 0;

        }
        catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong in deleteCart");
        }

    }
    async getNextCounter(db) {
        const resultDocument = await db.collection('counters').findOneAndUpdate(
            { _id: 'cartItemId' },         // Query to find the counter document
            { $inc: { value: 1 } },        // Increment the `value` field by 1
            { returnDocument: 'after', upsert: true }  // Return the updated document after incrementing
        );

        if (resultDocument.value) {
            console.log(resultDocument.value);   // Access the `value` field inside the `value` object
            return resultDocument.value;         // Return the incremented value
        }

        throw new Error("Failed to increment the counter");
    }
}


export default CartItemRepository