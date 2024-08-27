import jwt from "jsonwebtoken";
const jwtAuth = (req, res, next) => {
    //1. Read the token

    const token = req.headers["authorization"];

    //2. it no token return error
    if (!token) {
        return res.status(401).send("No authorization details found");
    }

    //3 check if token is valid
    try {
        //jwt.verify return payload which is present inside token
        const payload = jwt.verify(token, '&"@5:ytRD/3x`E$UiB{B')
        req.userId = payload.id;
        console.log(payload);
    }
    catch (err) {
        //return error
        return res.status(401).send("Unauthorized");
    }
    next();
}

export default jwtAuth;