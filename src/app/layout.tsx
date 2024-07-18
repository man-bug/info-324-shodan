import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import NextTopLoader from "nextjs-toploader";

import { Inter as FontSans } from "next/font/google";
import { Victor_Mono as FontMonoHeader } from "next/font/google";
import { JetBrains_Mono as FontMono } from "next/font/google";

import { ThemeProvider } from "next-themes";
import { DeviceProvider } from "./context/device-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getSession } from "@/lib/auth";
import { SessionProvider } from "./context/session-context";
import { Toaster } from "@/components/ui/toaster";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});
const fontMonoHeader = FontMonoHeader({
    subsets: ["latin"],
    variable: "--font-mono-header",
});
const fontMono = FontMono({
    subsets: ["latin"],
    variable: "--font-mono",
});

export const metadata: Metadata = {
    title: "Zoroark",
    description:
        "INFO-324 project to display BACnet devices retrieved from Shodan API and search NIST database for CVEs associated with device models.",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getSession();

    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn(
                    "min-h-screen font-mono text-[15px] md:text-[13px] antialiased bg-background",
                    fontSans.variable,
                    fontMono.variable,
                    fontMonoHeader.variable
                )}
                suppressHydrationWarning
            >
                <SessionProvider value={session}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <DeviceProvider>
                            <TooltipProvider>
                                <NextTopLoader shadow="none" showAtBottom />
                                <Toaster />
                                <div className="min-h-screen flex flex-col">{children}</div>
                            </TooltipProvider>
                        </DeviceProvider>
                    </ThemeProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
