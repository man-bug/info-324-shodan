"use client";

import React from "react";
import { Session, User } from "lucia";

export type SessionProviderProps = {
    user: User | null;
    session: Session | null;
};

const SessionContext = React.createContext<SessionProviderProps>({} as SessionProviderProps);

export function SessionProvider({
    children,
    value,
}: {
    children: React.ReactNode;
    value: SessionProviderProps;
}) {
    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export default function useSession() {
    const session = React.useContext(SessionContext);
    if (!session) throw new Error("useSession must be wrapped with SessionProvider");
    return session;
}
