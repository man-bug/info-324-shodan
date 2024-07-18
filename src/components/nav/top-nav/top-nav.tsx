import Link from "next/link";
import Logo from "@/components/assets/logo";
import { getSession } from "@/lib/auth";
import AuthBtns from "./auth-btns";

export default async function TopNav() {
    const session = await getSession();

    return (
        <header className="h-16 border-b bg-background py-4 px-6 flex items-center w-full">
            <nav className="flex items-center justify-between w-full">
                <Link href="/" className="flex items-center gap-2">
                    <Logo className="w-7 h-7" />
                    <span className="text-lg font-semibold font-mono-header">Zoroark</span>
                </Link>
                <div className="flex items-center gap-2">
                    <AuthBtns user={session.user} />
                </div>
            </nav>
        </header>
    );
}
