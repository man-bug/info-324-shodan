"use client";
import React from "react";
import { ShodanDevice } from "@/app/actions/fetch-shodan-devices";
import { useDeviceContext } from "@/app/context/device-context";
import { cn, findBestMatchingImage, imageMap } from "@/lib/utils";
import Image from "next/image";

export default function DeviceItem({
    device,
    searchQuery,
}: {
    device: ShodanDevice;
    searchQuery: string;
}) {
    const { setSelectedDevice, selectedDevice } = useDeviceContext();
    const imageKey = findBestMatchingImage(device.modelName);

    const highlightMatch = (text: string, query: string) => {
        if (!query || !text) return text;
        const parts = text.split(new RegExp(`(${query})`, "gi"));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ? (
                <mark key={index} className="rounded px-0.5">
                    {part}
                </mark>
            ) : (
                part
            )
        );
    };

    const renderHighlightedField = (label: string, value: string | undefined) => (
        <div className="flex justify-between items-end">
            <p className="font-bold leading-none">{label}</p>
            <div className="flex-grow border-b-2 border-dotted mx-0.5"></div>
            <p className="text-muted-foreground leading-none">
                {highlightMatch(value || "", searchQuery)}
            </p>
        </div>
    );

    return (
        <li
            id={device.ip}
            className={cn("border-b p-4 px-6", selectedDevice === device && "bg-accent-blue/5")}
        >
            <button
                className="grid lg:grid-cols-2 lg:grid-rows-1 gap-4 text-left w-full"
                onClick={() => setSelectedDevice(selectedDevice === device ? null : device)}
            >
                <div className="flex flex-col lg:flex-row gap-2">
                    {imageKey ? (
                        <Image
                            src={imageMap[imageKey]}
                            alt={device.modelName}
                            className="object-fit aspect-video w-[160px] rounded-lg shrink-0"
                        />
                    ) : (
                        <div className="w-[160px] aspect-video bg-muted rounded-lg flex items-center justify-center">
                            No image found :(
                        </div>
                    )}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <strong className="text-base">
                                {highlightMatch(device.modelName, searchQuery)}
                            </strong>
                        </div>
                        <p>{highlightMatch(device.ip, searchQuery)}</p>
                        <p>{highlightMatch(device.hostname, searchQuery)}</p>
                        <div className="mt-auto">
                            <p className="text-muted-foreground line-clamp-1">
                                {highlightMatch(device.organization, searchQuery)}
                            </p>
                            <p className="text-muted-foreground">
                                {highlightMatch(device.location, searchQuery)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col space-y-1">
                    {renderHighlightedField("Instance ID", device.instanceId)}
                    {renderHighlightedField("Object Name", device.objectName)}
                    {renderHighlightedField("Location Description", device.locationDesc)}
                    {renderHighlightedField("Vendor Name", device.vendorName)}
                    {renderHighlightedField("Application Software", device.applicationSoftware)}
                    {renderHighlightedField("Firmware", device.firmware)}
                    {renderHighlightedField("Description", device.description)}
                </div>
            </button>
        </li>
    );
}
