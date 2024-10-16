import { CartItemModel } from "./cartItem.model.js";
import { UserModel } from "../user/user.model.js";
import CartItemRepository from "./cartItem.repository.js";

export class CartItemController {
    constructor() {
        this.cartItemPepository = new CartItemRepository();
    }
    async addCart(req, res) {
        const { productId, quantity } = req.body;
        const userId = req.userId;


        const cartItem = await this.cartItemPepository.add(productId, userId, quantity);

        return res.status(201).send({ cartItem, message: "Item added to Cart Successfully" })
    }
    async getCart(req, res) {
        const userId = req.userId;

        const cartItems = await this.cartItemPepository.get(userId);
        console.log(cartItems, "inside controller")
        return res.status(200).send({ cartItems, message: "Item inside the cart" })

    }

    async deleteCart(req, res) {
        const userId = req.userId;
        const cartItemId = req.params.id;
        const isDeleted = await this.cartItemPepository.delete(cartItemId, userId);
        if (!isDeleted) {
            return res.status(404).send("Item not deleted")
        }

        return res.status(200).send("Item removed from cart")

    }
}