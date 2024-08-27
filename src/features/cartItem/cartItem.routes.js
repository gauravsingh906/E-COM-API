// Manage routes/paths to CartItemController

// 1. Import express.
import express from 'express';
import { CartItemController } from './cartItem.controller.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';



// 2. Initialize Express router.
const cartItemRouter = express.Router();
const cartItemController = new CartItemController();

// All the paths to the controller methods.
// localhost/api/cart
cartItemRouter.get(
    '/',
    cartItemController.getCart
);

cartItemRouter.post(
    '/',

    cartItemController.addCart
);
cartItemRouter.delete(
    '/:id',

    cartItemController.deleteCart
);







export default cartItemRouter;