import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

class ProductRepository {
    constructor() {
        this.collection = 'products';
    }
    async add(newProduct) {

        try {
            //Get the database  
            const db = getDB();
            //Get the collection    
            const collection = db.collection(this.collection);
            //3. to insert the document    
            await collection.insertOne(newProduct);
            return newProduct;

        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong in add product")
        }

    }

    async getAll() {
        try {
            //Get the database  
            const db = getDB();
            //Get the collection    
            const collection = db.collection(this.collection);
            //3. to insert the document    
            const products = await collection.find().toArray();
            return products;

        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong in getAll Product")
        }
    }

    async get(id) {
        try {
            // Get the database
            const db = getDB();
            // Get the collection
            const collection = db.collection(this.collection);

            // Ensure ObjectId is imported and used correctly
            const product = await collection.findOne({ _id: new ObjectId(id) });

            // Return the single product found
            return product;

        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong in get Product");
        }
    }
    // async filter(minPrice, maxPrice, category) {
    //     //Get the database  
    //     const db = getDB();
    //     //Get the collection    
    //     const collection = db.collection(this.collection);
    //     let filterExpression = {}

    //     if (minPrice) {
    //         filterExpression.price = { $gte: parseFloat(minPrice), };
    //     }
    //     if (maxPrice) {
    //         filterExpression.price = { ...filterExpression.price, $lte: parseFloat(maxPrice), };
    //     }
    //     if (category) {
    //         filterExpression.category = category;
    //     }
    //     const result = await collection.find(filterExpression).toArray();
    //     console.log(result);
    //     return result; 8
    // }


    async filter(minPrice, categories) {

        //Get the database  
        console.log(minPrice, categories)
        const db = getDB();
        //Get the collection    
        const collection = db.collection(this.collection);
        let filterExpression = {}

        if (minPrice) {
            filterExpression.price = { $gte: parseFloat(minPrice) };
        }

        categories = JSON.parse(categories.replace(/'/g, '"'));



        if (categories) {
            filterExpression = { $or: [{ category: { $in: categories } }, filterExpression] };
        }
        console.log(filterExpression)
        const result = await collection.find(filterExpression).project({ name: 1, price: 1, _id: 0, ratings: 1 }).toArray();
        console.log(result);
        return result;
    }













    //     async rateProduct(userId, productId, rating) {
    //         try {
    //             const db = getDB();
    //             const collection = db.collection(this.collection);
    //             const product = await collection.findOne({ _id: new ObjectId(productId) });

    //             if (!product) {
    //                 throw new ApplicationError("Product not found", 404);
    //             }

    //             //3. check if user rating is already available
    //             console.log(userId)
    //             const existingRating = product.ratings?.find(r => r.userId == userId);
    //             console.log(existingRating, "rating")
    //             if (existingRating) {

    //                 //3. if rating with given user id already present update the rating array
    //                 const result = await collection.updateOne(
    //                     { _id: new ObjectId(productId), "ratings.userId": new ObjectId(userId) },
    //                     { $set: { [`ratings.$.rating`]: rating } }
    //                 );
    //                 return result;
    //             }
    //             else {
    //                 //3. else add rating array
    //                 const result = await collection.updateOne(
    //                     { _id: new ObjectId(productId) },
    //                     { $push: { ratings: { userId: new ObjectId(userId), rating: rating } } }
    //                 );
    //                 return result;
    //             }
    //         }
    //         catch (err) {
    //             console.log(err);
    //             throw new ApplicationError("Something went wrong in rateProduct");
    //         }
    //     }


    async rateProduct(userId, productId, rating) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            // Remove existing array
            await collection.updateOne(
                { _id: new ObjectId(productId) },
                { $pull: { ratings: { userId: new ObjectId(userId) } } }
            );

            //3.add new rating 
            const result = await collection.updateOne(
                { _id: new ObjectId(productId) },
                { $push: { ratings: { userId: new ObjectId(userId), rating: rating } } }
            );
            return result;
        }

        catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong in rateProduct");
        }
    }

    async averageProductPricePerCategory() {
        try {

            const db = getDB();
            const collection = db.collection(this.collection);
            const result = await collection.aggregate([

                {
                    $group: {
                        _id: "$category",
                        avgPrice: { $avg: "$price" }
                    }
                }
            ]).toArray();
            console.log(result);
            return result;


        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong in rateProduct");
        }

    }
}



export default ProductRepository;