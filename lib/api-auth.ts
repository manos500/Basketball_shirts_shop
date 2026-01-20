// lib/api-auth.ts
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

type Session = {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
};

type AuthHandler = (
  request: NextRequest,
  session: Session
) => Promise<NextResponse>;

type OptionalAuthHandler = (
  request: NextRequest,
  session: Session | null
) => Promise<NextResponse>;

export function withAuth(handler: AuthHandler) {
  return async (request: NextRequest) => {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    return handler(request, session as Session);
  };
}

export function withOptionalAuth(handler: OptionalAuthHandler) {
  return async (request: NextRequest) => {
    const session = await auth.api.getSession({ headers: await headers() });
    return handler(request, session as Session | null);
  };
}

export function withAdminAuth(handler: AuthHandler) {
  return async (request: NextRequest) => {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" }, 
        { status: 403 }
      );
    }

    return handler(request, session as Session);
  };
}