import { Lucia } from "lucia";
import { cookies } from "next/headers";
import { cache } from "react";
import adapter from "./db/adapter";

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        expires: false,
        attributes: {
            secure: process.env.NODE_ENV === "production",
        },
    },
    getUserAttributes: (attributes) => {
        return {
            // attributes has the type of DatabaseUserAttributes
            username: attributes.username,
            avatar: attributes.avatar,
            createdAt: attributes.createdAt,
            role: attributes.role,
        };
    },
});

export const getSession = cache(async () => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId)
        return {
            user: null,
            session: null,
        };

    const { user, session } = await lucia.validateSession(sessionId);
    try {
        if (session && session.fresh) {
            const sessionCookie = lucia.createSessionCookie(session.id);
            cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        }
        if (!session) {
            const sessionCookie = lucia.createBlankSessionCookie();
            cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        }
    } catch {
        // Next.js throws error when attempting to set cookies when rendering page
    }
    return {
        user,
        session,
    };
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

interface DatabaseUserAttributes {
    username: string;
    avatar: string;
    createdAt: string;
    role: "user" | "admin";
}
