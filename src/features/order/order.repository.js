import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { OrderModel } from "./order.model.js";


export class OrderRepository {

    constructor() {
        this.collection = 'orders';
    }

    async placeOrder(userId) {
        const client = await getClient();
        const session = client.startSession();
        try {
            const db = getDB();

            session.startTransaction();
            //1. Get cartItems and calculate total amount
            const items = await this.getTotalAmount(userId, session);
            const finalTotalAmount = items.reduce((sum, item) => sum + item.totalAmount, 0);

            //2. create a record for order
            const newOrder = new OrderModel(userId, finalTotalAmount, new Date());
            await db.collection(this.collection).insertOne(newOrder, { session });

            // 3. Reduce the stock {product quantity}
            await Promise.all(items.map(async (item) => {
                await db.collection("products").updateOne(
                    { _id: item.productId },
                    { $inc: { stock: -item.quantity } },
                    { session }
                );
            }));

            // throw new ApplicationError("Something went wrong in placeOrder");
            //4. clean the cart
            await db.collection("cartItems").deleteMany(
                { userId: new ObjectId(userId) },
                { session }
            )
            session.commitTransaction();
            session.endSession();
            return newOrder;
        }
        catch (err) {
            session.abortTransaction();
            session.endSession();
            console.log(err);
            throw new ApplicationError("Something went wrong in placeOrder");
        }
    }


    async getTotalAmount(userId, session) {
        const db = getDB();

        // Perform aggregation to get the total amount
        const items = await db.collection("cartItems").aggregate([
            // 1. Match the cart items for the user
            { $match: { userId: new ObjectId(userId) } },

            // 2. Lookup product details from the products collection
            { $lookup: { from: "products", localField: "productId", foreignField: "_id", as: "productInfo" } },

            // 3. Unwind the productInfo array
            { $unwind: "$productInfo" },

            // 4. Calculate the total amount for each cart item
            { $addFields: { "totalAmount": { $multiply: ["$quantity", "$productInfo.price"] } } }
        ], { session }).toArray(); // Convert the cursor to an array
        console.log(items, "inside controller")
        // Now, calculate the final total amount
        return items;

    }

}