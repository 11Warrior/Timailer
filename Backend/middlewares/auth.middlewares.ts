import type { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

interface jwtPayload {
    id: string,
}

export const protectRoute = (req: Request, res: Response, next: NextFunction) => {
    try {
        // console.log(req.cookies);
        const token = req.cookies?.my_token;
        // console.log("Token:", token);

        if (!token) return res.status(401).json({ message: "Auth Token Missing" })

        const user = jwt.verify(token, process.env.JWT_SECRET!) as jwtPayload

        if (!user) return res.status(401).json({ message: "User not found at protect route middleware" })

        req.user = { id: user.id };
        // console.log(req.user)
        next();
    } catch (error) {
        console.log("Error in protect Route middleware handler.", error)
    }
}