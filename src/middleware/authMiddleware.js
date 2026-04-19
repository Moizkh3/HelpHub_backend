import jwt from "jsonwebtoken";
import userModel from "../models/User.js";

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized. Login Again' });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            req.userId = tokenDecode.id;
        } else {
            return res.json({ success: false, message: 'Not Authorized. Login Again' });
        }

        next();
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}


export const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) return res.json({ success: false, message: 'Not Authorized.' });

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(tokenDecode.id);

        if (!user || user.role !== 'admin') {
            return res.json({ success: false, message: 'Admin access required.' });
        }

        req.userId = user._id;
        next();
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export default userAuth;
