import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
class UserRepository {
    constructor() {
        this.collection = 'users';
    }
    async signUp(newUser) {

        try {
            //Get the database
            const db = getDB();
            //Get the collection
            const collection = db.collection(this.collection);

            //3. to insert the document
            await collection.insertOne(newUser);
            return newUser;

        } catch (err) {

            console.log(err);
        }


    }
    async findByEmail(email) {
        try {
            //Get the database
            const db = getDB();
            //Get the collection
            const collection = db.collection(this.collection);

            //3. to insert the document
            const user = await collection.findOne({ email });
            return user;

        } catch (err) {

            console.log(err);
            throw new ApplicationError("Something went wrong in findByEmail")
        }

    }

}



export default UserRepository