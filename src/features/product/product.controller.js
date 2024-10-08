import ProductModel from "./product.model.js";

export default class ProductController {

    getAllProducts(req, res) {
        const products = ProductModel.getAll();
        res.status(200).send(products);
    }

    addProduct(req, res) {
        const { name, price, sizes } = req.body;
        const newProduct = {
            name,
            price: parseFloat(price),
            sizes: sizes.split(','),
            imageUrl: req.file.filename,
        };
        const createdRecord = ProductModel.add(newProduct);
        res.status(201).send(createdRecord);
    }

    rateProduct(req, res, next) {
        try {
            const { userId, productId, rating } = reqs.query;
            ProductModel.rateProduct(userId, productId, rating);
            return res.status(200).send("Successfully adding Rating");

        }
        catch (err) {
            console.log("error passing through productController");
            next(err);
        }
    }

    getOneProduct(req, res) {
        const id = req.params.id;
        const product = ProductModel.get(id);
        if (!product) {
            res.status(400).send("Product Not Found");
        }
        else {
            res.status(200).send(product);
        }
    }
    filterProducts(req, res) {
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;
        const category = req.query.category;
        const result = ProductModel.filter(
            minPrice,
            maxPrice,
            category
        );
        res.status(200).send(result);
    }
}