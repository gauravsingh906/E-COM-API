import { CartItemModel } from "./cartItem.model.js";
import { UserModel } from "../user/user.model.js";

export class CartItemController {
    addCart(req, res) {
        const { productId, quantity } = req.query;
        const userId = req.userId;
        const user = UserModel.getAll().find(u => userId == u.id);
        if (!user) {
            return "User not found";
        }
        const cartItem = CartItemModel.add(productId, userId, quantity);
        return res.status(201).send({ cartItem, message: "Item added to Cart Successfully" })
    }
    getCart(req, res) {
        const userId = req.userId;
        const user = UserModel.getAll().find(u => userId == u.id);
        if (!user) {
            return "User not found";
        }
        const cartItems = CartItemModel.get(userId);
        return res.status(200).send({ cartItems, message: "Item inside the cart" })

    }

    deleteCart(req, res) {
        const userId = req.userId;
        const cartItemId = req.params.id;
        const err = CartItemModel.delete(cartItemId, userId);
        if (err) {
            return res.status(404).send(err);
        }
        return res.status(200).send("Item removed from cart")

    }
}