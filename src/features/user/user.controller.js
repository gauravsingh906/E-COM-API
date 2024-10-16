import { UserModel } from "./user.model.js";
import jwt from "jsonwebtoken"
import UserRepository from "./user.repository.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import bcrypt from "bcrypt";
export class UserController {
    constructor() {
        this.UserRepository = new UserRepository()
    }
    async signUp(req, res) {
        const { name, email, password, type } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new UserModel(
            name, email, hashedPassword, type
        )

        const user = await this.UserRepository.signUp(newUser);
        console.log(user)
        return res.status(201).send(user);

    }
    async signIn(req, res) {
        const { email, password } = req.body;
        try {

            //find user by email
            const user = await this.UserRepository.findByEmail(email);
            if (!user) {
                return res.status(404).send("User not Registered");
            }
            else {
                //compare password with hashed password
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    return res.status(400).send("Invalid Credentials");
                }
                else {
                    //3. create token
                    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2d' });
                    //4. send token
                    res.status(200).send(token);
                }
            }


            //3. to insert the document 


        } catch (err) {

            console.log(err);
            throw new ApplicationError("Something went wrong in SignIn")
        }

    }
}

export default new UserController();
