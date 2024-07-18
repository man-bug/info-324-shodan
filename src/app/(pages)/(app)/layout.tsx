import SideNav from "@/components/nav/side-nav/side-nav";
import TopNav from "@/components/nav/top-nav/top-nav";

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen flex">
            <SideNav />
            <div className="flex flex-col w-full">
                <TopNav />
                {children}
            </div>
        </div>
    );
}
