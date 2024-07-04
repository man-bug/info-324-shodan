import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import NextTopLoader from "nextjs-toploader";

import { Inter as FontSans } from "next/font/google";
import { JetBrains_Mono as FontMono } from "next/font/google";
import SideNav from "@/components/nav/side-nav";
import TopNav from "@/components/nav/top-nav";
import { ThemeProvider } from "next-themes";
import { ModelProvider } from "./context/model-context";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});
const fontMono = FontMono({
    subsets: ["latin"],
    variable: "--font-mono",
});

export const metadata: Metadata = {
    title: "Zoroark",
    description: "",
};

export default async function RootLayout({
    children,
}: Readonly<{
        children: React.ReactNode;
    }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn(
                    "min-h-screen font-mono text-[15px] md:text-[13px] antialiased bg-background",
                    fontSans.variable,
                    fontMono.variable,
                )}
                suppressHydrationWarning
            >
                <NextTopLoader shadow="none" showAtBottom />
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <ModelProvider>
                        <div className="min-h-screen flex">
                            <SideNav />
                            <div className="flex flex-col w-full">
                                <TopNav />
                                {children}
                            </div>
                        </div>
                    </ModelProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
