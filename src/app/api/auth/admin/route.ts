// src/app/api/auth/admin/impersonate.ts
import { db } from "@/db";
import { getAuthSession } from "@/lib/authOption";
import { Session } from "next-auth";
import { getCsrfToken } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const session = await getAuthSession();
  const queryParams = req.nextUrl.searchParams;
  const userIdToImpersonate = queryParams.get("userId");

  if (!userIdToImpersonate) {
    return NextResponse.json({ message: "you must provide user impersonate id" }, { status: 400 });

  }
  // Check if the current user is an admin
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ message: "You must be an admin to impersonate a user" }, { status: 401 });
  }


  const userToImpersonate = await db.user.findFirst({ where: { id: userIdToImpersonate } });
  if (!userToImpersonate) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  // Create a new session object with the impersonated user's details
  const newSession: Session = {
    ...session,
    user: {
      ...session.user,
      name: userToImpersonate.name,
      email: userToImpersonate.email,
      image: userToImpersonate.image,
      role: userToImpersonate.role,
    },
  };
  console.log(newSession)

  const updateSession = async (newSession: Record<string, any>) => {
    await fetch(`http://localhost:3000/api/auth/session`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        csrfToken: await getCsrfToken(),
        data: newSession,
      }),
    })
  }

  const impersonated = await updateSession(newSession)
  console.log(impersonated)

  return NextResponse.json({ message: "User impersonated" }, { status: 200 });
}