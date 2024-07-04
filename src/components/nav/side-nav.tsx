"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { useModelContext } from "@/app/context/model-context";
import { fetchCveData, CveResult } from "@/app/actions/fetch-cve-data";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Button } from "../ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

function getLastTwoSentences(text: string): string {
    const sentences = text.match(/[^.!?]+[.!?]+/g);
    if (!sentences) {
        return text;
    }
    const lastTwo = sentences.slice(-2).join(' ').trim();
    return lastTwo;
};


function getModelSuggestions(model: string): string[] {
    const segments = model.split(/[-\s]+/);
    const suggestions = new Set<string>();

    for (let i = 0; i < segments.length; i++) {
        // ccmbine segments up to the current segment
        const combinedSegments = segments.slice(0, i + 1).join('-');
        suggestions.add(combinedSegments);

        // add each segment individually
        suggestions.add(segments[i]);

        // combine all segments except the last one (if more than one segment)
        if (segments.length > 1 && i === segments.length - 1) {
            suggestions.add(segments.slice(0, -1).join('-'));
        }
    }

    // filter out the original model and any suggestions that are one character long
    const filteredSuggestions = Array.from(suggestions).filter(s => s !== model && s.length > 1);

    // if the only suggestion left is the original model or a one-character suggestion, return an empty array
    if (filteredSuggestions.length === 0) {
        return [];
    }

    return filteredSuggestions;
}

export default function SideNav() {
    const { selectedModel, setSelectedModel } = useModelContext();
    const [cveData, setCveData] = React.useState<CveResult[] | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [retries, setRetries] = React.useState(0);

    React.useEffect(() => {
        if (selectedModel) {
            const fetchData = async () => {
                if (selectedModel.length > 1 && selectedModel !== "NULL") {
                    setLoading(true);
                    setError(null);
                    try {
                        const data = await fetchCveData(selectedModel);
                        setCveData(data);
                    } catch (err: any) {
                        setError(err.message);
                    } finally {
                        setLoading(false);
                    }
                } else {
                    setError('Invalid model selected');
                }
            };
            fetchData();
        };
    }, [selectedModel, retries]);

    return (
        <aside className="w-72 max-w-72 shrink-0 py-4 px-2 bg-secondary/40 border-r h-screen max-h-screen overflow-y-scroll grow">
            <div className="space-y-2">
                <Title className="line-clamp-1 leading-[1.2]">
                    {selectedModel ? `Model: ${selectedModel}` : "Vulnerabilities"}
                </Title>
                <Description>
                    {selectedModel ?
                        (loading ? "Loading CVEs..." : error)
                        : "Select a BACnet device to view CVEs associated with the model."
                    }
                </Description>
                {error && <Button variant="outline" onClick={() => setRetries((prev) => prev++)}>
                    <ReloadIcon className="w-4 h-4 mr-2" />
                    Try again
                </Button>}
                {selectedModel && (
                    <>
                        {cveData && !loading && !error && (
                            cveData.length > 0 ? (
                                <ul className="">
                                    <Description className="text-destructive pt-2">
                                        <span className="bg-muted/50 border rounded-md p-1 font-bold">{cveData.length}</span>&nbsp;CVE(s) found
                                    </Description>
                                    {cveData.map((cve, idx) => (
                                        <li key={idx} className="text-sm">
                                            {/* count */}
                                            <div className="relative w-full flex items-center py-8">
                                                <div className="grow h-px bg-border"/>
                                                <span className="px-2 font-bold uppercase rounded-full bg-muted/50 border aspect-square grid items-center">{idx + 1}</span>
                                                <div className="grow h-px bg-border"/>
                                            </div>
                                            <div className="flex flex-col space-y-2">
                                                {/* header */}
                                                <p className="font-bold">
                                                    <span>
                                                        {cve.id}
                                                        {cveData && !loading && !error && (
                                                            cve.references.map((reference, idx) => (
                                                                <Link key={reference.url + idx} href={reference.url} target="_blank" className="text-[10px] ml-0.5 text-blue-400 align-super">
                                                                    [{idx + 1}]
                                                                </Link>
                                                            ))
                                                        )}
                                                    </span>
                                                </p>
                                                <p className="text-muted-foreground">{getLastTwoSentences(cve.description)}</p>
                                                {/* severity + tags */}
                                                {[
                                                    { label: "Severity", value: cve.severity },
                                                    { label: "Tags", value: cve.tags.length > 1 ? cve.tags.join(', ') : "NULL" }
                                                ].map((item) => (
                                                        <div className="flex justify-between items-end" key={item.label}>
                                                            <p className="font-bold text-foreground leading-none">{item.label}</p>
                                                            <div className="flex-grow border-b-2 border-dotted mx-0.5"></div>
                                                            <p className={cn("text-muted-foreground leading-none", item.value === "CRITICAL" && "text-destructive font-bold")}>{item.value}</p>
                                                        </div>
                                                    ))}
                                                {/* impact */}
                                                <div className="flex flex-col shrink-0">
                                                    {[
                                                        { label: "Confidentiality", value: cve.confidentialityImpact },
                                                        { label: "Integrity", value: cve.integrityImpact },
                                                        { label: "Availability", value: cve.availabilityImpact }
                                                    ].map((impact) => (
                                                            <div key={impact.label} className="flex items-center justify-between gap-2 py-1">
                                                                <span className="text-[13px] text-muted-foreground">{impact.label}</span>
                                                                <Badge key={idx} className={cn("w-fit !bg-muted/50 border", impact.value === "HIGH" ? "!text-destructive" : "!text-foreground")}>{impact.value}</Badge>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                    <div>
                                        <p>No CVEs found for {selectedModel}.</p>
                                        <div className="mt-4">
                                            {getModelSuggestions(selectedModel).length > 0 ? (
                                                <>
                                                    <p className="font-bold">Try these suggestions:</p>
                                                    {getModelSuggestions(selectedModel).map((suggestion) => (
                                                        <button
                                                            key={suggestion}
                                                            className="text-blue-500 underline mt-2 block"
                                                            onClick={() => setSelectedModel(suggestion)}
                                                        >
                                                            {suggestion}
                                                        </button>
                                                    ))}
                                                </>
                                            ) : (
                                                    <p>We couldn&apos;t come up with any suggestions :(</p>
                                                )}
                                        </div>
                                    </div>
                                )
                        )}
                    </>
                )}
            </div>
        </aside>
    );
}

export function Title({ className, children }: { className?: string, children: React.ReactNode }) {
    return (
        <h3
            className={cn("text-lg font-semibold leading-none tracking-tight", className)}
        >
            {children}
        </h3>
    );
}

export function Description({ className, children }: { className?: string, children: React.ReactNode }) {
    return (
        <p
            className={cn("text-sm text-muted-foreground", className)}
        >
        {children}
        </p>
    );
}
