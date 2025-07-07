import { currentUser } from "@clerk/nextjs/server"

import { db } from "./prisma";
import { inngest } from "./inngest/client";

export const checkUser = async () => {
    const user = await currentUser()

    if (!user) {
        return null;
    }
    try {
        const loggedInUser = await db.user.findUnique({
            where: {
                clerkUserId: user.id
            }
        });
        if (loggedInUser) {
            return loggedInUser
        }


        const name = `${user.firstName} ${user.lastName}`

        const newUser = await db.user.create({
            data: {
                clerkUserId: user.id,
                name,
                imageUrl: user.imageUrl,
                email: user.emailAddresses[0].emailAddress
            }
        });

        await inngest.send({
            name: "user/signed-up",
            data: {
                userId: newUser.id,
                email: newUser.email,
                name: newUser.name,
            },
        });

        return newUser

    } catch (error) {
        console.log(error.message , "error in Chechk User")
    }

}
