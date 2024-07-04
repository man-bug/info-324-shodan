"use client";
import React, { useEffect, useRef, useState } from "react";
import { fetchShodanDevices, ShodanResult } from "./actions/fetch-shodan-devices";
import { Button } from "@/components/ui/button";
import { useModelContext } from "@/app/context/model-context";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

export default function Home() {
    const [devices, setDevices] = useState<ShodanResult[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const searchRef = useRef<HTMLDivElement | null>(null);

    const { setSelectedModel, selectedModel } = useModelContext();

    const router = useRouter();

    useEffect(() => {
        const getDevices = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchShodanDevices();
                setDevices(data);
            } catch (err: any) {
                setError(err.message);
            }
            setLoading(false);
        };
        getDevices();
    }, []);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (searchRef.current && !searchRef.current.contains(target)) {
                setIsSearching(false);
            }
        };

        if (isSearching) {
            document.addEventListener('click', handleClick);
        }

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [isSearching]);

    const getMatchingValue = (result: ShodanResult, query: string): string | null => {
        const searchFields: (keyof ShodanResult)[] = [
            'ip', 'hostname', 'organization', 'location', 'instanceId', 'objectName',
            'locationDesc', 'vendorName', 'applicationSoftware', 'firmware', 'modelName', 'description'
        ];

        for (let field of searchFields) {
            if (result[field] && result[field].toLowerCase().includes(query.toLowerCase())) {
                return result[field];
            }
        }
        return null;
    };

    const highlightMatch = (text: string, query: string) => {
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ? <mark key={index} className="font-bold">{part}</mark> : part
        );
    };

    const filteredDevices = devices?.filter((result) => {
        return getMatchingValue(result, searchQuery) !== null;
    });

    return (
        <div className="grow max-h-[calc(100vh-64px)] overflow-y-scroll">
            {error && <p className="text-destructive">{error}</p>}
            <main className="max-w-5xl mx-auto px-8 xl:px-0">
                <div className="py-16 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">BACnet Devices</h1>
                    <span className="text-muted-foreground">(port:47808 hostname:.edu)</span>
                </div>

                {isSearching && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-50"
                    />
                )}
                <div className="relative z-[60] mb-8" ref={searchRef}>
                    <Input
                        id="search"
                        autoComplete="off"
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onFocus={() => setIsSearching(true)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        className={cn("!ring-0 placeholder:uppercase bg-background", isSearching && "!rounded-b-none border-b-0 z-[70]")}
                    />
                    <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-5 select-none items-center gap-1 rounded-md border bg-secondary/50 px-1.5 text-[11px] font-medium opacity-100 sm:flex">CTRL + K</kbd>
                    <AnimatePresence>
                        {isSearching && filteredDevices && (
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
                                        opacity: { duration: 0.1 }
                                    }
                                }}
                                transition={{ type: "tween", duration: 0.2 }}
                                className="absolute top-full bg-background w-full border border-t-0 rounded-b-md z-[60] max-h-72 overflow-y-scroll"
                            >
                                <ul className="grid grid-cols-1 grid-flow-row">
                                    {searchQuery
                                        ? filteredDevices.map((result, idx) => {
                                            const matchingValue = getMatchingValue(result, searchQuery);
                                            return (
                                                <li
                                                    key={idx}
                                                    className="border-b last-of-type:border-b-0 hover:bg-secondary/50"
                                                    onClick={() => {
                                                        setIsSearching(false);
                                                        router.push(`#${result.ip}`);
                                                        setSelectedModel(result.modelName);
                                                    }}
                                                >
                                                    <Button className="h-full w-full !bg-transparent text-foreground/80 hover:text-foreground px-3 py-2 text-left justify-between">
                                                        <p>{highlightMatch(result.modelName, searchQuery)}</p>
                                                        <span className="text-muted-foreground">({highlightMatch(matchingValue || '', searchQuery)})</span>
                                                    </Button>
                                                </li>
                                            );
                                        })
                                        : <div className="p-3">Search for IPs, device models, locations, vendors, and more.</div>
                                    }
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <ul className="grid grid-cols-1 grid-flow-row">
                    {(loading || !devices) && <p>Loading...</p>}
                    {devices &&
                        devices.map((result, idx) => (
                            <li id={result.ip} key={idx} className="border-b first-of-type:border-t py-4">
                                <div className="grid lg:grid-cols-2 lg:grid-rows-1 gap-4">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                value={result.modelName}
                                                checked={selectedModel === result.modelName}
                                                onCheckedChange={() => setSelectedModel(
                                                        selectedModel === result.modelName ? null : result.modelName
                                                )}
                                                onClick={() => setSelectedModel(result.modelName)}
                                            >
                                                {selectedModel === result.modelName ? "Model selected" : "Select"}
                                            </Checkbox>
                                        <p className="font-bold text-base">{result.modelName}</p>
                                        </div>
                                        <p>{result.ip}</p>
                                        <p>{result.hostname}</p>
                                        <div className="mt-auto">
                                        <p className="text-muted-foreground line-clamp-1">{result.organization}</p>
                                        <p className="text-muted-foreground">{result.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        {[
                                            { label: "Instance ID", value: result.instanceId },
                                            { label: "Object Name", value: result.objectName },
                                            { label: "Location Description", value: result.locationDesc },
                                            { label: "Vendor Name", value: result.vendorName },
                                            { label: "Application Software", value: result.applicationSoftware },
                                            { label: "Firmware", value: result.firmware },
                                            { label: "Description", value: result.description }
                                        ].map((item, index) => (
                                                <div className="flex justify-between items-end" key={index}>
                                                    <p className="font-bold leading-none">{item.label}</p>
                                                    <div className="flex-grow border-b-2 border-dotted mx-0.5"></div>
                                                    <p className="text-muted-foreground leading-none">{item.value}</p>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </li>
                        ))}
                </ul>
            </main>
        </div>
    );
}
