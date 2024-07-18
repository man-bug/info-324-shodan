import React from "react";
import { fetchShodanDevices, refreshShodanDevices } from "@/app/actions/fetch-shodan-devices";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import SearchBar from "./_components/search-bar";
import DeviceList from "./_components/device-list";

export default async function Home() {
    const devices = await fetchShodanDevices();

    return (
        <div className="grow max-h-[calc(100vh-64px)] overflow-y-scroll">
            <main>
                <div className="px-6 py-16 flex items-center justify-between">
                    <h1 className="text-2xl font-bold leading-none font-mono-header">
                        BACnet Devices
                    </h1>
                    <form action={refreshShodanDevices}>
                        <Button type="submit" variant="outline" size="sm">
                            <ReloadIcon className="mr-2 h-4 w-4" />
                            Refresh
                        </Button>
                    </form>
                </div>
                <SearchBar initialDevices={devices} />
                <DeviceList initialDevices={devices} />
            </main>
        </div>
    );
}
