import { UserModel } from "./user.model.js";
import jwt from "jsonwebtoken"
export class UserController {
    signUp(req, res) {
        const { name, email, password, type } = req.body;
        const user = UserModel.signUp(name, email, password, type);
        return res.status(201).send(user);

    }
    signIn(req, res) {
        const { email, password } = req.body;
        const result = UserModel.signIn(email, password);
        if (!result) {
            return res.status(400).send("Invalid Credentials");
        }
        else {
            //1. create token
            const token = jwt.sign({ id: result.id, email: result.email }, '&"@5:ytRD/3x`E$UiB{B', { expiresIn: '2d' })
            //2. send token
            res.status(200).send(token);
        }

    }
}