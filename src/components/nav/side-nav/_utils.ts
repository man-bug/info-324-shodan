import { ShodanDevice } from "@/app/actions/fetch-shodan-devices";

export function getDeviceSuggestions(device: ShodanDevice | null): string[] {
    if (!device) return [];

    const suggestions = new Set<string>();

    function addSuggestions(value: string) {
        if (value === "NULL") return;

        suggestions.add(value);
        const segments = value.split(/[-\s_]+/);
        for (let i = 1; i < segments.length; i++) {
            suggestions.add(segments.slice(0, i).join("-"));
        }
        segments.forEach((segment) => {
            if (segment.length > 1) suggestions.add(segment);
        });
    }

    ["modelName", "objectName", "vendorName"].forEach((field) => {
        const value = device[field as keyof ShodanDevice];
        if (typeof value === "string" && value !== "NULL") {
            addSuggestions(value);
        }
    });

    const rules = [(s: string) => s.length > 1, (s: string) => !/^\d+$/.test(s), (s: string) => s.length <= 20];

    return Array.from(suggestions)
        .filter((s) => rules.every((rule) => rule(s)))
        .sort((a, b) => b.length - a.length);
}

export function getLastTwoSentences(text: string): string {
    const sentences = text.match(/[^.!?]+[.!?]+/g);
    if (!sentences) {
        return text;
    }
    const lastTwo = sentences.slice(-2).join(" ").trim();
    return lastTwo;
}
