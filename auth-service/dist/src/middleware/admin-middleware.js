"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAdmin = void 0;
const jwt = require('jsonwebtoken');
const authorizeAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ poruka: "Pristup odbijen! Morate biti prijavljeni kao admin." });
    }
    const token = authHeader.split(' ')[1];
    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.uloga !== "admin") {
            return res.status(403).json({ poruka: "Nemate dozvolu za pristup ovoj ruti." });
        }
        next();
    }
    catch (err) {
        return res.status(403).json({ poruka: "Token nije validan." });
    }
};
exports.authorizeAdmin = authorizeAdmin;
