"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAdmin = void 0;
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
console.log("2kkju");
console.log(JWT_SECRET);
const authorizeAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ poruka: "Pristup odbijen! Morate biti prijavljeni kao admin." });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // Proveri da li korisnik ima ulogu admin
        if (decoded.uloga !== 'admin') {
            return res.status(403).json({ poruka: "Nemate dozvolu za pristup ovoj ruti." });
        }
        // Ako je uloga admin, nastavljamo sa rutom
        next();
    }
    catch (err) {
        return res.status(403).json({ poruka: "Token nije validan." });
    }
};
exports.authorizeAdmin = authorizeAdmin;
