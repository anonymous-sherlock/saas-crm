import { db } from "@/db";
import { registerFormSchema } from "@/schema/authFormSchema";
import { privateProcedure, publicProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";
import { nanoid } from "nanoid";
import { z } from "zod";

export const userRouter = router({
  add: publicProcedure.input(registerFormSchema).mutation(async ({ input }) => {
    const { name, email, password } = input;
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

  get: privateProcedure.query(async ({ ctx }) => {
    const { userId, isImpersonating, actor } = ctx;
    const user = db.user.findFirst({
      where: {
        id: isImpersonating ? actor.userId : userId,
      },

      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        active: true,
        apiKeys: true,
        BearerToken: true,
      },
    });

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }
    return user;
  }),
  generateApi: privateProcedure.mutation(async ({ ctx }) => {
    const { userId, isImpersonating, actor } = ctx;
    const user = db.user.findFirst({
      where: {
        id: isImpersonating ? actor.userId : userId,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }
    const existingApiKey = await db.apiKey.findFirst({
      where: { userId: isImpersonating ? actor.userId : userId, enabled: true },
    });

    if (existingApiKey) {
      const data = await db.$transaction([
        db.apiKey.update({
          where: { id: existingApiKey.id },
          data: {
            enabled: false,
          },
        }),

        db.apiKey.create({
          data: {
            key: nanoid(32),
            enabled: true,
            userId: isImpersonating ? actor.userId : userId,
          },
        }),
      ]);

      return { ...data[1] };
    }
    const newApiKey = db.apiKey.create({
      data: {
        key: nanoid(32),
        enabled: true,
        userId: isImpersonating ? actor.userId : userId,
      },
    });

    return newApiKey;
  }),
  generateBearerToken: privateProcedure.mutation(async ({ ctx }) => {
    const { userId, isImpersonating, actor } = ctx;
    const user = db.user.findFirst({
      where: {
        id: isImpersonating ? actor.userId : userId,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }
    const existingBearerToken = await db.bearerToken.findFirst({
      where: { userId: isImpersonating ? actor.userId : userId, active: true },
    });

    if (existingBearerToken) {
      const data = await db.$transaction([
        db.bearerToken.update({
          where: { id: existingBearerToken.id },
          data: {
            active: false,
          },
        }),

        db.bearerToken.create({
          data: {
            key: `${nanoid(32)}${randomUUID()}${randomUUID()}`.replace(/-/g, ""),
            active: true,
            userId: userId,
          },
        }),
      ]);

      return { ...data[1] };
    }
    const newBearerKey = db.bearerToken.create({
      data: {
        key: `${nanoid(32)}${randomUUID()}${randomUUID()}`.replace(/-/g, ""),
        active: true,
        userId: isImpersonating ? actor.userId : userId,
      },
    });

    return newBearerKey;
  }),
  getProduct: privateProcedure
    .input(
      z.object({
        productId: z.string({
          required_error: "product Id is required to delete a product",
        }),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { userId, isImpersonating, actor } = ctx;
      const { productId } = input;
      const product = await db.product.findMany({
        where: {
          ownerId: isImpersonating ? actor.userId : userId,
          id: productId,
        },
      });
      if (!product)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });

      return {
        success: "true",
        product,
      };
    }),
});

export type UserRouter = typeof userRouter;
