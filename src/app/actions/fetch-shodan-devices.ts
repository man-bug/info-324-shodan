"use server";
import { revalidateTag } from "next/cache";

export type ShodanDevice = {
    ip: string;
    hostname: string;
    organization: string;
    location: string;
    instanceId: string;
    objectName: string;
    locationDesc: string;
    vendorName: string;
    applicationSoftware: string;
    firmware: string;
    modelName: string;
    description: string;
};

export async function fetchShodanDevices() {
    console.log(`[${new Date().toISOString()}] Fetching Shodan devices`);
    const query = "port:47808 hostname:.edu";
    const apiKey = process.env.SHODAN_API_KEY;
    if (!apiKey) {
        throw new Error("Missing Shodan API key");
    }
    try {
        const response = await fetch(`https://api.shodan.io/shodan/host/search?key=${apiKey}&query=${query}`, {
            cache: "force-cache",
            next: { tags: ["shodan-devices"] },
        });

        const data = await response.json();
        if (!response.ok) {
            console.error(
                `[${new Date().toISOString()}] Failed to fetch data from Shodan. Error: ${data.error || "Unknown error"}`
            );
            throw new Error(data.error || "Failed to fetch data from Shodan");
        }

        const extractedDevices = data.matches.map((match: any) => ({
            ip: match.ip_str,
            hostname: match.hostnames?.[0] ?? "NULL",
            organization: match.org ?? "NULL",
            location: `${match.location.country_name ?? "NULL"}, ${match.location.city ?? "NULL"}`,
            instanceId: match.bacnet?.instance_id ?? "NULL",
            objectName: match.bacnet?.object ?? "NULL",
            locationDesc: match.bacnet?.location ?? "NULL",
            vendorName: match.bacnet?.name ?? "NULL",
            applicationSoftware: match.bacnet?.appsoft ?? "NULL",
            firmware: match.bacnet?.firmware ?? "NULL",
            modelName: match.bacnet?.model ?? "NULL",
            description: match.bacnet?.desc ?? "NULL",
        }));

        console.log(`[${new Date().toISOString()}] Extraction complete. Returning ${extractedDevices.length} devices.`);
        return extractedDevices;
    } catch (error: any) {
        console.error(`[${new Date().toISOString()}] Error in fetchShodanDevices: ${error.message}`);
        throw new Error(error.message);
    }
}

export async function refreshShodanDevices() {
    "use server";
    console.log(`[${new Date().toISOString()}] Refreshing Shodan devices cache`);
    try {
        revalidateTag("shodan-devices");
    } catch (error: any) {
        console.error(`[${new Date().toISOString()}] Error revalidating 'shodan-devices' tag: ${error.message}`);
        throw new Error(`Failed to revalidate: ${error.message}`);
    }
}
