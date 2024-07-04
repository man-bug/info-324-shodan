"use server";

export type ShodanResult = {
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
}

export async function fetchShodanDevices() {
    const query = 'port:47808 hostname:.edu';
    const apiKey = process.env.SHODAN_API_KEY;

    if (!apiKey) {
        throw new Error('Missing Shodan API key');
    }

    try {
        const response = await fetch(`https://api.shodan.io/shodan/host/search?key=${apiKey}&query=${query}`,
            {
                cache: "default"
            }
        );
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch data from Shodan');
        }

        // Extract required information
        const extractedDevices = data.matches.map((match: any) => ({
            ip: match.ip_str,
            hostname: match.hostnames?.[0] ?? "NULL",
            organization: match.org ?? "NULL",
            location: `${match.location.country_name ?? "NULL"}, ${match.location.city ?? 'NULL'}`,
            instanceId: match.bacnet?.instance_id ?? "NULL",
            objectName: match.bacnet?.object ?? "NULL",
            locationDesc: match.bacnet?.location ?? "NULL",
            vendorName: match.bacnet?.name ?? "NULL",
            applicationSoftware: match.bacnet?.appsoft ?? "NULL",
            firmware: match.bacnet?.firmware ?? "NULL",
            modelName: match.bacnet?.model ?? "NULL",
            description: match.bacnet?.desc ?? "NULL",
        }));

        return extractedDevices;
    } catch (error: any) {
        throw new Error(error.message);
    }
}
