"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

export function ThemeToggleBtn() {
    const { setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <SunIcon className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <MoonIcon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[1000]">
                <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function ThemeToggleTabs() {
    const { setTheme, theme } = useTheme();

    return (
        <Tabs defaultValue={theme} className="px-2 pb-1.5">
            <TabsList className="grid grid-cols-3 h-fit">
                <TabsTrigger className="py-0.5" value="light" onClick={() => setTheme("light")}>
                    Light
                </TabsTrigger>
                <TabsTrigger className="py-0.5" value="dark" onClick={() => setTheme("dark")}>
                    Dark
                </TabsTrigger>
                <TabsTrigger className="py-0.5" value="system" onClick={() => setTheme("system")}>
                    System
                </TabsTrigger>
            </TabsList>
        </Tabs>
    );
}
