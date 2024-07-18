"use client";

import React, { useState } from "react";
import { ShodanDevice } from "@/app/actions/fetch-shodan-devices";
import DeviceItem from "./device-item";
import DeviceSkeleton from "./device-skeleton";

export default function DeviceList({ initialDevices }: { initialDevices: ShodanDevice[] }) {
    const [devices] = useState<ShodanDevice[]>(initialDevices);

    return (
        <ul className="grid grid-cols-1 grid-flow-row">
            {devices
                ? devices.map((device, idx) => <DeviceItem key={idx} device={device} />)
                : Array(5)
                      .fill(0)
                      .map((_, index) => <DeviceSkeleton key={index} />)}
        </ul>
    );
}
