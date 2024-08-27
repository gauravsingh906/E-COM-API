// 1. Import express and other required modules
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'; // Use swagger-ui-express
import productRouter from './src/features/product/product.routes.js';
import userRouter from './src/features/user/user.routes.js';
import cartItemRouter from './src/features/cartItem/cartItem.routes.js';
import jwtAuth from './src/middlewares/jwt.middleware.js';
// import apiDocs from './swagger.json' assert {type: 'json'};
import apiDocs from './swaggerc.json' assert {type: 'json'};
import loggerMiddleware from './src/middlewares/logger.middleware.js';
import { ApplicationError } from './src/error-handler/applicationError.js';


// 2. Create Server
const server = express();

// CORS policy configuration

// var corsOptions = {
//     origin: "http://localhost:5500"
//   }
//   server.use(cors(corsOptions));

server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500/');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    // return ok for preflight request.
    if (req.method == "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
})

//application level middleware


server.use(bodyParser.json()); // Middleware to parse JSON bodies



// Serve Swagger API docs
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDocs));

server.use(loggerMiddleware);


// Define routes
server.use('/api/products', jwtAuth, productRouter);
server.use('/api/users', userRouter);
server.use('/api/cartItems', jwtAuth, cartItemRouter);

// Default request handler
server.get('/', (req, res) => {
    res.send("Welcome to Ecommerce APIs");
});
//Error handle middleware always kept in last
server.use((err, req, res, next) => {
    console.log(err);

    if (err instanceof ApplicationError) {
        res.status(err.code).send(err.message);
    }

    //handle server error
    res.status(503).send("Something went wrong , try again later")
})

//Middleware to handler 404 requests
server.use((req, res) => {
    res.status(404).send("API not found, Please check our documentation for more information at localhost:3500/api-docs");
});

// Specify port
server.listen(3500, () => {
    console.log("Server is running at http://localhost:3500");
});
