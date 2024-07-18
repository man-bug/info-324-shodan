"use server";
import { z } from "zod";
import { generateIdFromEntropySize } from "lucia";
import db from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getSession, lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { RegisterSchema } from "@/validation/register";
import { LoginSchema } from "@/validation/login";

// REGISTER
const SALT_ROUNDS = 12;
export async function registerUser(values: z.infer<typeof RegisterSchema>) {
    const hashedPassword = await bcrypt.hash(values.password, SALT_ROUNDS);
    const userId = generateIdFromEntropySize(15);

    try {
        const existingUser = await db.query.users.findFirst({
            where: (table) => eq(table.username, values.username),
        });

        if (existingUser) {
            return { error: "This username is already in use." };
        }

        await db.insert(users).values({
            id: userId,
            username: values.username,
            hashedPassword,
            role: "user",
        });

        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

        return { success: true, message: "Account created successfully" };
    } catch (err: any) {
        return { error: err?.message };
    }
}

// LOGIN
export async function LoginUser(values: z.infer<typeof LoginSchema>) {
    try {
        const existingUser = await db.query.users.findFirst({
            where: (table) => eq(table.username, values.username),
        });
        if (!existingUser || !existingUser.hashedPassword) {
            return { error: "Invalid credentials, try again." };
        }

        const isValidPassword = await bcrypt.compare(values.password, existingUser.hashedPassword);
        if (!isValidPassword) {
            return { error: "Invalid credentials, try again." };
        }

        const session = await lucia.createSession(existingUser.id, {
            expiresIn: 60 * 60 * 24 * 30,
        });
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

        return {
            success: true,
            message: "Logged in successfully",
        };
    } catch (err: any) {
        return { error: err?.message };
    }
}

// SIGN OUT
export async function signOut() {
    try {
        const { session } = await getSession();
        if (!session) return { error: "Unauthorized" };

        await lucia.invalidateSession(session.id);
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

        return { success: true, message: "Signed out successfully", redirect: "/home" };
    } catch (err: any) {
        console.log(err);
        return { error: err?.message };
    }
}
