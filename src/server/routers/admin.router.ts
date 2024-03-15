import { db } from "@/db";
import { newUserSchema } from "@/schema/user.schema";
import { privateProcedure, publicProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";
import { nanoid } from "nanoid";
import { z } from "zod";

export const adminRouter = router({
  addUser: privateProcedure.input(newUserSchema).mutation(async ({ input }) => {
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
        role: role,
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

  getAllUser: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx
    const users = await db.user.findMany({
      where: {
        id: { not: userId }
      },
      include: { company: { select: { id: true, name: true, address: true } } },
      orderBy: {
        createdAt: "desc"
      }
    })

    return users
  })
  ,
  deleteUser: privateProcedure
    .input(
      z.object({
        userIds: z
          .string({
            required_error: "User Id is required to delete a user",
          })
          .array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, actor, isImpersonating } = ctx;
      const { userIds } = input;
      const users = await db.user.findMany({
        where: {
          id: {
            in: userIds,
          },
        },
      });
      if (!users)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "user not found",
        });

      const deletedUsers = await db.user.deleteMany({
        where: {
          id: {
            in: userIds,
          },
        },
      });
      const deletedCount = deletedUsers.count;
      return {
        success: "true",
        deletedUsers,
        deletedCount,
      };
    }),
});

export type AdminRouter = typeof adminRouter;
