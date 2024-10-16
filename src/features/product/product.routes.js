// Manage routes/paths to ProductController

// 1. Import express.
import express from 'express';
import ProductController from './product.controller.js';

import { upload } from '../../middlewares/fileUpload.middleware.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';

// 2. Initialize Express router.
const productRouter = express.Router();
const productController = new ProductController();

// All the paths to the controller methods.
// localhost/api/products 

productRouter.get(
    '/', jwtAuth,
    (req, res) => {
        productController.getAllProducts(req, res);
    }
);
productRouter.post(
    '/',
    upload.single('imageUrl'),
    (req, res) => {
        productController.addProduct(req, res)
    });


productRouter.post('/rate',
    (req, res, next) => {
        productController.rateProduct(req, res, next)
    });


// localhost:4100/api/products/filter?minPrice=10&maxPrice=20&category=Category1
//sequence of route is most important /filter pahle hoga  /:id
productRouter.get(
    '/filter', jwtAuth,
    (req, res) => {
        productController.filterProducts(req, res)
    });

productRouter.get(
    '/averagePrice',
    (req, res) => {
        productController.averagePrice(req, res);
    })


// localhost:4100/api/products/filter?minPrice=10&maxPrice=20&category=Category1
productRouter.get(
    '/filter',
    productController.filterProducts
);
productRouter.get(
    '/:id',
    (req, res) => {
        productController.getOneProduct(req, res);
    })


export default productRouter;