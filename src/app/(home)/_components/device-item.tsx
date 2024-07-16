"use client";

import React from "react";
import { ShodanDevice } from "@/app/actions/fetch-shodan-devices";
import { Checkbox } from "@/components/ui/checkbox";
import { useDeviceContext } from "@/app/context/device-context";
import { cn } from "@/lib/utils";

export default function DeviceItem({ device }: { device: ShodanDevice }) {
    const { setSelectedDevice, selectedDevice } = useDeviceContext();

    return (
        <li
            id={device.ip}
            className={cn("border-b p-4 px-6", selectedDevice === device && "bg-blue-500/5 dark:bg-blue-200/5")}
        >
            <div className="grid lg:grid-cols-2 lg:grid-rows-1 gap-4">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            value={device.modelName}
                            checked={selectedDevice === device}
                            onCheckedChange={() => setSelectedDevice(selectedDevice === device ? null : device)}
                            onClick={() => setSelectedDevice(device)}
                        >
                            {selectedDevice === device ? "Model selected" : "Select"}
                        </Checkbox>
                        <p className="font-bold text-base">{device.modelName}</p>
                    </div>
                    <p>{device.ip}</p>
                    <p>{device.hostname}</p>
                    <div className="mt-auto">
                        <p className="text-muted-foreground line-clamp-1">{device.organization}</p>
                        <p className="text-muted-foreground">{device.location}</p>
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
            </div>
        </li>
    );
}