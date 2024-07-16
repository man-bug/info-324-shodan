"use client";

import React from "react";
import { useDeviceContext } from "@/app/context/device-context";
import { fetchCveData, CveResult } from "@/app/actions/fetch-cve-data";
import { Button } from "@/components/ui/button";
import { InfoCircledIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { CveItem } from "./cve-item";
import { getDeviceSuggestions } from "./_utils";

export default function SideNav() {
    const { selectedDevice, setSelectedDevice } = useDeviceContext();
    const [cveData, setCveData] = React.useState<CveResult[] | null>(null);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (selectedDevice) {
            const fetchData = async () => {
                if (selectedDevice && selectedDevice.modelName !== "NULL") {
                    setLoading(true);
                    setError(null);
                    try {
                        const data = await fetchCveData(selectedDevice.modelName);
                        setCveData(data);
                    } catch (err: any) {
                        setError(err.message);
                    } finally {
                        setLoading(false);
                    }
                } else {
                    setError("Invalid model selected");
                }
            };
            fetchData();
        }
    }, [selectedDevice]);
    const handleSearch = () => setSelectedDevice({ ...selectedDevice!, modelName: searchQuery });

    return (
        <aside className="w-72 max-w-72 shrink-0 py-4 px-2 bg-secondary/40 border-r h-screen max-h-screen overflow-y-scroll grow">
            <div className="space-y-4">
                <h3 className="line-clamp-1 leading-[1.2] text-lg font-semibold tracking-tight">
                    {selectedDevice ? `Model: ${selectedDevice.modelName}` : "Select a model"}
                </h3>
                {selectedDevice && (
                    <>
                        {loading ? (
                            <>
                                <Skeleton className="h-9 w-full" />
                                <div className="flex items-center">
                                    <div className="grow h-px bg-border" />
                                    <Skeleton className="w-[26px] h-[26px] rounded-full" />
                                    <div className="grow h-px bg-border" />
                                </div>
                            </>
                        ) : cveData ? (
                            <>
                                <CveCountDisplay count={cveData.length} deviceName={selectedDevice.modelName} />
                                {cveData.length > 0 ? (
                                    <ul>
                                        {cveData.map((cve, idx) => (
                                            <CveItem key={idx} cve={cve} index={idx} />
                                        ))}
                                    </ul>
                                ) : (
                                    <>
                                        <SearchInput
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onSearch={handleSearch}
                                        />
                                        <div className="relative w-full flex items-center">
                                            <div className="grow h-px bg-border" />
                                            <span className="px-2 font-bold uppercase">OR</span>
                                            <div className="grow h-px bg-border" />
                                        </div>
                                        <div>
                                            {getDeviceSuggestions(selectedDevice).length > 0 ? (
                                                <>
                                                    <p className="font-bold">Try these suggestions:</p>
                                                    {getDeviceSuggestions(selectedDevice).map((suggestion) => (
                                                        <button
                                                            key={suggestion}
                                                            className="text-blue-500 underline underline-offset-4 mt-2 block"
                                                            onClick={() =>
                                                                setSelectedDevice({
                                                                    ...selectedDevice,
                                                                    modelName: suggestion,
                                                                })
                                                            }
                                                        >
                                                            {suggestion}
                                                        </button>
                                                    ))}
                                                </>
                                            ) : (
                                                <p>We couldn&apos;t come up with any suggestions :(</p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : null}
                    </>
                )}
            </div>
        </aside>
    );
}

function CveCountDisplay({ count, deviceName }: { count: number; deviceName: string }) {
    return (
        <div className="relative h-9 px-2 bg-background flex justify-between items-center border rounded-md p-1 font-bold">
            <span className={count > 0 ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"}>
                {count} CVE(s) found
            </span>
            <Tooltip delayDuration={50}>
                <TooltipTrigger className="h-9 w-9 border rounded-md rounded-l-none absolute -right-px -top-px grid place-items-center bg-secondary">
                    <InfoCircledIcon className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[60ch] text-pretty">
                    {count > 0
                        ? `This result indicates possible vulnerabilities, but does not mean the ${deviceName} device is compromised.`
                        : `This result does not mean the ${deviceName} device is secure. Try to broaden your search with the suggestions below.`}
                </TooltipContent>
            </Tooltip>
        </div>
    );
}

function SearchInput({
    value,
    onChange,
    onSearch,
}: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearch: () => void;
}) {
    return (
        <div className="relative">
            <Input
                id="search"
                autoComplete="off"
                type="text"
                placeholder="Search..."
                value={value}
                onChange={onChange}
                className="!ring-0 placeholder:uppercase bg-background"
            />
            <Button
                onClick={onSearch}
                size="icon"
                variant="secondary"
                className="uppercase absolute right-0 top-0 rounded-l-none border"
            >
                <MagnifyingGlassIcon className="w-4 h-4" />
            </Button>
        </div>
    );
}