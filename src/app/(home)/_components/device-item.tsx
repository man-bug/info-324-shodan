"use client";

import React from "react";
import { ShodanDevice } from "@/app/actions/fetch-shodan-devices";
import { useDeviceContext } from "@/app/context/device-context";
import { cn, findBestMatchingImage, imageMap } from "@/lib/utils";
import Image from "next/image";

export default function DeviceItem({ device }: { device: ShodanDevice }) {
    const { setSelectedDevice, selectedDevice } = useDeviceContext();
    const imageKey = findBestMatchingImage(device.modelName);

    return (
        <li
            id={device.ip}
            className={cn(
                "border-b p-4 px-6",
                selectedDevice === device && "bg-blue-500/5 dark:bg-blue-200/5"
            )}
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
                            <strong className="text-base">{device.modelName}</strong>
                        </div>
                        <p>{device.ip}</p>
                        <p>{device.hostname}</p>
                        <div className="mt-auto">
                            <p className="text-muted-foreground line-clamp-1">
                                {device.organization}
                            </p>
                            <p className="text-muted-foreground">{device.location}</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col space-y-1">
                    {[
                        { label: "Instance ID", value: device.instanceId },
                        { label: "Object Name", value: device.objectName },
                        { label: "Location Description", value: device.locationDesc },
                        { label: "Vendor Name", value: device.vendorName },
                        { label: "Application Software", value: device.applicationSoftware },
                        { label: "Firmware", value: device.firmware },
                        { label: "Description", value: device.description },
                    ].map((item, index) => (
                        <div className="flex justify-between items-end" key={index}>
                            <p className="font-bold leading-none">{item.label}</p>
                            <div className="flex-grow border-b-2 border-dotted mx-0.5"></div>
                            <p className="text-muted-foreground leading-none">{item.value}</p>
                        </div>
                    ))}
                </div>
            </button>
        </li>
    );
}
