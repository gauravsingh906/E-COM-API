import { UserModel } from "../user/user.model.js";
import ProductModel from "../product/product.model.js";

export class CartItemModel {
    constructor(productId, userId, quantity, id) {
        this.productId = productId;
        this.userId = userId;
        this.quantity = quantity;
        this.id = id;
    }

    static add(productId, userId, quantity) {

        //1. validate user and product

        const user = UserModel.getAll().find(u => userId == u.id);
        if (!user) {
            return "User not found";
        }
        //valdate product
        const product = ProductModel.getAll().find(p => p.id == productId);
        if (!product) {
            return "Product not found";
        }
        const newCartItem = new CartItemModel(productId, userId, quantity);
        newCartItem.id = cartItems.length + 1;
        cartItems.push(newCartItem);
        return newCartItem;
    }
    static get(userId) {
        return cartItems.filter(u => userId == u.userId);
    }
    static delete(cartItemId, userId) {
        //check if cartItem present in Cart
        const cartItemIndex = cartItems.findIndex(cart => cart.id == cartItemId &&
            cart.userId == userId);
        if (cartItemIndex == -1) {
            return "No Items found"
        }
        else {
            cartItems.splice(cartItemIndex, 1);
            //console.log(cartItems, cartItemIndex)

        }

    }
}

let cartItems = [
    new CartItemModel(2, 2, 3, 1),
    new CartItemModel(3, 1, 4, 2),
]