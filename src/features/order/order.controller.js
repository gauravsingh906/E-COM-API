import { OrderRepository } from "./order.repository.js";
export class OrderController {

    constructor() {
        this.orderRepository = new OrderRepository();
    }

    async placeOrder(req, res) {
        try {
            const userId = req.userId;
            const order = await this.orderRepository.placeOrder(userId);
            res.status(201).json({ order });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to place order' });
        }
    }

}