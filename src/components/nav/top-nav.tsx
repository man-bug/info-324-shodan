import Logo from "../assets/logo";
import { ThemeToggleBtn } from "../ui/mode-toggle";

export default function TopNav() {
    return (
        <header className="h-16 border-b bg-background py-4 px-6 flex items-center w-full">
            <nav className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                    <Logo className="w-7 h-7" />
                    <span className="text-lg font-semibold">Zoroark</span>
                </div>
                <ThemeToggleBtn />
            </nav>
        </header>
    )
}
