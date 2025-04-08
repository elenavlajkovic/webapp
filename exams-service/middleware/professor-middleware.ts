const jwt = require('jsonwebtoken');
import express from 'express';

export const authorizeProfessor = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log("Authorization header nije pronađen ili je neispravan");
        return res.status(401).json({ poruka: "Pristup odbijen! Morate biti prijavljeni kao profesor." });
    }

    const token = authHeader.split(' ')[1];

    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        const decoded: any = jwt.verify(token, JWT_SECRET);

        if (decoded.uloga !== "profesor") {
            console.log("Korisnik nije profesor");
            return res.status(403).json({ poruka: "Nemate dozvolu za pristup ovoj ruti." });
        }

        next();
    } catch (err) {
        console.log("Token nije validan:", err);
        return res.status(403).json({ poruka: "Token nije validan." });
    }
};
