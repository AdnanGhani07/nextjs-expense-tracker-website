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
    return await db.user.create({
        data: {
            clerkUserId: user.id,
            email: user.emailAddresses[0].emailAddress,
            name: `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
        },
    });
};