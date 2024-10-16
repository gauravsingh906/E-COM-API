import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
    //1. Read the token

    const token = req.headers["authorization"];

    //2. it no token return error
    if (!token) {
        return res.status(401).send("No authorization details found");
    }
    console.log(token)
    //3 check if token is valid
    try {
        //jwt.verify return payload which is present inside token

        const payload = jwt.verify(token, process.env.JWT_SECRET)
        console.log(payload)
        req.userId = payload.id;

    }
    catch (err) {
        //return error
        return res.status(401).send("Unauthorized");
    }
    next();
}

export default jwtAuth;