const jwt = require("jsonwebtoken");
const User = require("../models/users");
const secret=process.env.JWT_SECRET;

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        let tokenSplit= token.split(' ');
        const decoded= jwt.verify(tokenSplit[1],secret);
        const user = await User.findOne({_id: decoded._id, 'tokens.token': tokenSplit[1]})

        if(!user){
            throw new Error("User is not found")
        }
        req.user=user;
        next()

    }catch (e) {
        res.status(401).json({error: "Please authenticate or log in again"});
    }

}

module.exports = auth