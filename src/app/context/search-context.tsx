"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { ShodanDevice } from "@/app/actions/fetch-shodan-devices";

type SearchContextType = {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filteredDevices: ShodanDevice[];
    setFilteredDevices: (devices: ShodanDevice[]) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredDevices, setFilteredDevices] = useState<ShodanDevice[]>([]);

    return (
        <SearchContext.Provider
            value={{ searchQuery, setSearchQuery, filteredDevices, setFilteredDevices }}
        >
            {children}
        </SearchContext.Provider>
    );
};

export const useSearchContext = () => {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error("useSearchContext must be used within a SearchProvider");
    }
    return context;
};
