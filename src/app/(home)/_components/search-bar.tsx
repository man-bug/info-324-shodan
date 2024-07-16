"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDeviceContext } from "@/app/context/device-context";
import { ShodanDevice } from "@/app/actions/fetch-shodan-devices";

export default function SearchBar({ initialDevices }: { initialDevices: ShodanDevice[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [devices] = useState<ShodanDevice[]>(initialDevices);
    const searchRef = useRef<HTMLDivElement | null>(null);
    const { setSelectedDevice } = useDeviceContext();
    const router = useRouter();

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (searchRef.current && !searchRef.current.contains(target)) {
                setIsSearching(false);
            }
        };

        if (isSearching) {
            document.addEventListener("click", handleClick);
        }

        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, [isSearching]);

    const getMatchingValue = (result: ShodanDevice, query: string): string | null => {
        const searchFields: (keyof ShodanDevice)[] = [
            "ip",
            "hostname",
            "organization",
            "location",
            "instanceId",
            "objectName",
            "locationDesc",
            "vendorName",
            "applicationSoftware",
            "firmware",
            "modelName",
            "description",
        ];

        for (let field of searchFields) {
            if (result[field] && result[field].toLowerCase().includes(query.toLowerCase())) {
                return result[field];
            }
        }
        return null;
    };

    const highlightMatch = (text: string, query: string) => {
        const parts = text.split(new RegExp(`(${query})`, "gi"));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ? (
                <mark key={index} className="font-bold">
                    {part}
                </mark>
            ) : (
                part
            )
        );
    };

    const filteredDevices = devices.filter((result) => {
        return getMatchingValue(result, searchQuery) !== null;
    });

    return (
        <div
            className={cn(
                "z-30 py-4 px-6 sticky top-0",
                isSearching ? "" : "backdrop-blur-lg bg-background/60 border-b"
            )}
            ref={searchRef}
        >
            <Input
                id="search"
                autoComplete="off"
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onFocus={() => setIsSearching(true)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className={cn(
                    "!ring-0 placeholder:uppercase bg-background px-4",
                    isSearching && "!rounded-b-none border-b-0 z-[70]"
                )}
            />
            <AnimatePresence>
                {isSearching && (
                    <motion.div
                        initial={{ translateY: -20, opacity: 0 }}
                        animate={{
                            translateY: 0,
                            opacity: 1,
                        }}
                        exit={{
                            translateY: -20,
                            opacity: 0,
                            transition: {
                                opacity: { duration: 0.1 },
                            },
                        }}
                        transition={{ type: "tween", duration: 0.2 }}
                        className="absolute top-full -mt-4 bg-background w-[calc(100%-48px)] border border-t-0 rounded-b-md z-[60] max-h-72 overflow-y-scroll"
                    >
                        <ul className="grid grid-cols-1 grid-flow-row">
                            {searchQuery ? (
                                filteredDevices.map((result, idx) => {
                                    const matchingValue = getMatchingValue(result, searchQuery);
                                    return (
                                        <li
                                            key={idx}
                                            className="border-b last-of-type:border-b-0 first-of-type:border-t hover:bg-secondary/50"
                                            onClick={() => {
                                                setIsSearching(false);
                                                router.push(`#${result.ip}`);
                                                setSelectedDevice(result);
                                            }}
                                        >
                                            <Button className="h-full w-full shadow-none rounded-none !bg-transparent text-foreground/80 hover:text-foreground px-4 py-2 text-left justify-between">
                                                <p>{highlightMatch(result.modelName, searchQuery)}</p>
                                                <span className="text-muted-foreground">
                                                    ({highlightMatch(matchingValue || "", searchQuery)})
                                                </span>
                                            </Button>
                                        </li>
                                    );
                                })
                            ) : (
                                <div className="p-4 border-t">
                                    Search for IPs, device models, locations, vendors, and more.
                                </div>
                            )}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
