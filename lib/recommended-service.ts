// lib/recommended-service.ts

import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";

export const getRecommended = async () => {
    let userId;
    let userName;

    try {
        const self = await getSelf();
        userId = self.id;
        userName=self.username;
    } catch {
        userId = null;
    }

    let users = [];

    if (userId) {
        users = await db.user.findMany({
            where: {
                NOT: {
                    // id: userId,
                    username: userName
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    } else {
        users = await db.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    return users;
};