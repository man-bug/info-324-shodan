"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";
import { ShodanDevice } from "../actions/fetch-shodan-devices";

type DeviceContextType = {
    selectedDevice: ShodanDevice | null;
    setSelectedDevice: (device: ShodanDevice | null) => void;
};

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider = ({ children }: { children: ReactNode }) => {
    const [selectedDevice, setSelectedDevice] = useState<ShodanDevice | null>(null);

    return (
        <DeviceContext.Provider value={{ selectedDevice, setSelectedDevice }}>
            {children}
        </DeviceContext.Provider>
    );
};

export const useDeviceContext = () => {
    const context = useContext(DeviceContext);
    if (context === undefined) {
        throw new Error("useDeviceContext must be used within a DeviceProvider");
    }
    return context;
};
