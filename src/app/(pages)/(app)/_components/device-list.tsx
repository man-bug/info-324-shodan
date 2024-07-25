"use client";
import React from "react";
import { ShodanDevice } from "@/app/actions/fetch-shodan-devices";
import DeviceItem from "./device-item";
import { useSearchContext } from "@/app/context/search-context";

export default function DeviceList({ initialDevices }: { initialDevices: ShodanDevice[] }) {
    const { filteredDevices, searchQuery } = useSearchContext();

    const devices = searchQuery ? filteredDevices : initialDevices;

    return (
        <ul className="grid grid-cols-1 grid-flow-row">
            {devices.map((device, idx) => (
                <DeviceItem key={idx} device={device} searchQuery={searchQuery} />
            ))}
        </ul>
    );
}
