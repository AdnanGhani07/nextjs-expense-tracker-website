import { currentUser } from "@clerk/nextjs/server";

import { db } from "./db";

export const checkUser = async () => {
    const user = await currentUser();
    if (!user) return null;

    const existingUser = await db.user.findUnique({
        where: {
            clerkUserId: user.id,
        },
    });

    if (existingUser) return existingUser;

    const email = user.emailAddresses?.[0]?.emailAddress || `${user.id}@noemail.clerk`;
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'User';

    return await db.user.create({
        data: {
            clerkUserId: user.id,
            email,
            name: fullName,
            imageUrl: user.imageUrl || null,
        },
    });
};