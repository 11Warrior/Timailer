import type { User } from "@prisma/client";
import type { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import prisma from "../../db/prisma.ts";

export const callback = (req: Request, res: Response) => {
    const user = req.user as User;

    if (!user) {
        return res.status(401).json({ message: "User is possibly undefined / null" })
    }

    const token = jwt.sign({
        id: user.id,
        email: user.Email,
        name: user.FullName,
        image: user.profileImage
    },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
    )

    res.cookie("my_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: '/'
    });


    res.redirect(`${process.env.FRONTEND_URL!}/dashboard`)
}

export const getMe = async (req: Request, res: Response) => {
    try {
        const { id } = req?.user as { id: string };
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                emails: true,
            },

        })

        if (!user) return res.status(401).json({ message: "User not authenticated" });

        // console.log(id)
        return res.json({
            id: user?.id,
            email: user?.Email,
            name: user?.FullName,
            image: user?.profileImage
        });
    } catch (error) {
        console.log("Error while getting authenticated user", error)
    }
}

export const logOut = async (req: Request, res: Response) => {
    try {
        res.clearCookie('my_token', {
            httpOnly: true,
            sameSite: "lax",
            secure: true,
            path: '/'
        });

        res.redirect(`${process.env.FRONTEND_URL}/`)

    } catch (error) {
        console.log("Error while logging out", error)
    }
}