import { db } from "@/db";
import { registerFormSchema } from "@/schema/authFormSchema";
import { publicProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { hash } from "bcrypt";

export const userRouter = router({
  add: publicProcedure.input(registerFormSchema).mutation(async ({ input }) => {
    const { name, email, password } = input;
    const existingUser = await db.user.findUnique({ where: { email: email } });
    if (existingUser) throw new TRPCError({ code: "CONFLICT", message: "User with this email already exist" });

    const hashPassword = await hash(password, 16);
    const newUser = await db.user.create({
      data: {
        name: name,
        email: email,
        password: hashPassword,
        wallet: { create: { balance: 0 } },
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
