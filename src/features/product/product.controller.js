import { parse } from "dotenv";
import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";

export default class ProductController {
    constructor() {
        this.productRespository = new ProductRepository();
    }

    async getAllProducts(req, res) {
        const products = await this.productRespository.getAll();
        res.status(200).send(products);
    }

    async addProduct(req, res) {
        const { name, price, sizes, category, desc } = req.body;
        const newProduct = new ProductModel(
            name, desc,
            parseFloat(price),
            req.file.filename, category,
            sizes.split(','),
        )


        const createdRecord = await this.productRespository.add(newProduct);
        res.status(201).send(createdRecord);
    }

    async rateProduct(req, res, next) {
        try {
            const userId = req.userId;
            const { productId, rating } = req.body;
            await this.productRespository.rateProduct(userId, productId, rating);
            return res.status(200).send("Successfully adding Rating");

        }
        catch (err) {
            console.log("error passing through productController");
            next(err);
        }
    }

    async getOneProduct(req, res) {
        const id = req.params.id;
        const product = await this.productRespository.get(id);
        if (!product) {
            res.status(400).send("Product Not Found");
        }
        else {
            res.status(200).send(product);
        }
    }
    async filterProducts(req, res) {
        const minPrice = req.query.minPrice;
        // const maxPrice = req.query.maxPrice;
        const categories = req.query.categories;

        const result = await this.productRespository.filter(
            //   maxPrice,
            minPrice,

            categories
        );
        res.status(200).send(result);
    }
    async averagePrice(req, res) {
        const result = await this.productRespository.averageProductPricePerCategory();
        res.status(200).send(result);
    }
}