import passport from 'passport'
import {
    Strategy as GoogleStrategy,
    type Profile,
    type VerifyCallback
} from 'passport-google-oauth20'

import prisma from '../db/prisma.ts';
import type { Request } from 'express';

passport.use(
    new GoogleStrategy({
        clientID: process.env.OAUTH_CLIENT_ID!,
        clientSecret: process.env.OAUTH_CLIENT_SECRET!,
        callbackURL: 'http://localhost:3000/timailer/auth/google/callback',
        passReqToCallback: true
    }, async (req: Request, accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
        const email = profile.emails?.[0]?.value;
        const avatar = profile.photos?.[0]?.value || " ";

        const user = await prisma.user.upsert({
            where: { id: profile.id },
            update: {
                FullName: profile.displayName,
                profileImage: avatar,
            },
            create: {
                Email: email!,
                Password: "",
                FullName: profile.displayName,
                profileImage: avatar,
            },
        });

        return done(null, user);
    })
)