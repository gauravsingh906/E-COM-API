
### E-commerce API

## Screenshots
https://github.com/gauravsingh906/E-COM-API/blob/main/Screenshot%20(52).png


## Overview
The E-commerce API is a RESTful service that provides functionality for managing products, users, and shopping carts in an online store. It offers secure user authentication and comprehensive product management features.

## Features

User registration and authentication
Product management (CRUD operations)
Shopping cart functionality
Swagger documentation for easy API exploration

## Prerequisites

Node.js (v14 or later)
npm (v6 or later)
MongoDB (v4 or later)

## Installation

Clone the repository:
Copygit clone https://github.com/yourusername/ecommerce-api.git
cd ecommerce-api

## Install dependencies:
npm install

## Set up environment variables:
Create a .env file in the root directory and add the following:
CopyPORT=3500
MONGODB_URI=mongodb://localhost:27017/ecommerceapi
JWT_SECRET=your_jwt_secret_key

## Start the server:
npm start



## API Reference

#### Get all items

```http
  GET /api/items
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get item

```http
  GET /api/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### add(num1, num2)

Takes two numbers and returns the sum.

## API Documentation
Once the server is running, you can access the Swagger documentation at:
Copyhttp://localhost:3500/api-docs
This provides a detailed overview of all available endpoints and how to use them.

## Main Endpoints

/api/users: User registration, login, and profile management
/api/products: Product creation, retrieval, update, and deletion
/api/cartItems: Shopping cart management

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. To access protected routes, include the JWT token in the Authorization header of your requests:
CopyAuthorization: Bearer your_jwt_token
CORS Configuration
The API is configured to accept requests from http://127.0.0.1:5500. If you need to change this, modify the CORS settings in server.js.
Error Handling
The API returns appropriate HTTP status codes along with error messages in
