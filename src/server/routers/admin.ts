import { db } from "@/db";
import { registerFormSchema } from "@/schema/authFormSchema";
import { newUserSchema } from "@/schema/userSchema";
import { privateProcedure, publicProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";
import { nanoid } from "nanoid";
import { z } from "zod";

export const userRouter = router({
    addUser: publicProcedure.input(newUserSchema).mutation(async ({ input }) => {
        const { name, email, password, role } = input;
        const existingUser = await db.user.findUnique({
            where: {
                email: email,
            },
        });
        if (existingUser) {
            throw new TRPCError({
                code: "CONFLICT",
                message: "User with this email already exist",
            });
        }
        const hashPassword = await hash(password, 16);
        const newUser = await db.user.create({
            data: {
                name: name,
                email: email,
                password: hashPassword,
                apiKeys: {
                    create: {
                        key: nanoid(32),
                    },
                },
                BearerToken: {
                    create: {
                        key: `${nanoid(32)}${randomUUID()}${randomUUID()}`.replace(/-/g, ""),
                    },
                },
            },
        });

        return {
            success: true,
            message: "User created successfully",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
            },
        };
    }),
});

export type UserRouter = typeof userRouter;
