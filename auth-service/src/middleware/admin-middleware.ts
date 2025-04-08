const jwt = require('jsonwebtoken');
import express from 'express';



export const authorizeAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ poruka: "Pristup odbijen! Morate biti prijavljeni kao admin." });
        }

        const token = authHeader.split(' ')[1];


        try {
            const JWT_SECRET = process.env.JWT_SECRET;
            const decoded: any = jwt.verify(token, JWT_SECRET);

            if (decoded.uloga !== "admin") {
                return res.status(403).json({ poruka: "Nemate dozvolu za pristup ovoj ruti." });
            }

            next();
        } catch (err) {
            return res.status(403).json({ poruka: "Token nije validan." });
        }
};
