"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    BarChartIcon,
    CircleBackslashIcon,
    ClipboardIcon,
    DashboardIcon,
    DotsHorizontalIcon,
    ExitIcon,
    GearIcon,
    LockClosedIcon,
    PersonIcon,
} from "@radix-ui/react-icons";
import { ThemeToggleBtn, ThemeToggleTabs } from "@/components/ui/theme-toggle";
import { signOut } from "@/app/(pages)/(auth)/actions";
import { User } from "lucia";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@radix-ui/react-dropdown-menu";

export default function AuthBtns({ user }: { user: User | null }) {
    const { toast } = useToast();

    async function handleLogout() {
        if (!user) return;
        try {
            const result = await signOut();
            if (result.success) {
                toast({
                    title: `You have signed out of ${user.username}`,
                    description: result.message,
                });
            } else if (result.error) {
                toast({
                    title: "Sign out failed",
                    description: result.error,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "An error occurred",
                description: "Unable to sign out. Please try again.",
                variant: "destructive",
            });
        }
    }
    return user ? (
        <div className="flex items-center gap-0">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 px-2 shrink-0">
                        <Avatar className="h-5 w-5 text-[11px]">
                            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="normal-case line-clamp-1 leading-[1.2]">
                            {user.username}
                        </span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[250px]">
                    {user.role === "admin" && (
                        <>
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>Admin</DropdownMenuLabel>
                                <DropdownMenuItem>
                                    <DashboardIcon className="mr-2 h-4 w-4" />
                                    <span>Dashboard</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <ClipboardIcon className="mr-2 h-4 w-4" />
                                    <span>Reports</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                        </>
                    )}
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Account</DropdownMenuLabel>
                        <DropdownMenuItem
                            onSelect={handleLogout}
                            className="text-destructive/80 hover:text-destructive focus:text-destructive"
                        >
                            <ExitIcon className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Theme</DropdownMenuLabel>
                        <ThemeToggleTabs />
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    ) : (
        <>
            <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
                <Link href="/register">Register</Link>
            </Button>
            <ThemeToggleBtn />
        </>
    );
}
