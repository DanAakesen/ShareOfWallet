import { IDropdownOption } from "@fluentui/react";

export function getUniqueCountries(
    dataset: ComponentFramework.PropertyTypes.DataSet,
    countryField: string
): { key: string; text: string }[] {
    if (!countryField || !dataset || !dataset.sortedRecordIds) {
        console.error("Invalid input to getUniqueCountries:", { dataset, countryField });
        return [];
    }
    const uniqueCountries = Array.from(
        new Set(
            dataset.sortedRecordIds
                .map(recordId => {
                    const record = dataset.records[recordId];
                    if (!record) {
                        console.warn("Missing record for ID:", recordId);
                        return null;
                    }
                    const country = record.getValue(countryField);
                    // Handle lookup fields by extracting the `name` property
                    return typeof country === "object" && country !== null && "name" in country
                        ? country.name
                        : (country as string | null);
                        
                })
                .filter((country): country is string => country !== undefined && country !== null && country !== "")
                
        )
    );
    return uniqueCountries.map(country => ({
        key: country ?? "",
        text: country ?? "",
    }));
}

export function getUniqueRegions(
        
        dataset: ComponentFramework.PropertyTypes.DataSet,
        regionField: string
        
    ): { key: string; text: string }[] {
    if (!regionField || !dataset || !dataset.sortedRecordIds) {
        console.error("Invalid input to getUniqueRegions:", { dataset, regionField });
        return [];
    }
    const uniqueRegions = Array.from(
        new Set(
            dataset.sortedRecordIds
                .map(recordId => {
                    const record = dataset.records[recordId];
                    if (!record) {
                        console.warn("Missing record for ID:", recordId);
                        return null;
                    }
                    const region = record.getValue(regionField);
                    // Handle lookup fields by extracting the `name` property
                    return typeof region === "object" && region !== null && "name" in region
                        ? region.name
                        : (region as string | null);
                })
                .filter((region): region is string => region !== undefined && region !== null && region !== "")
        )
    );
    return uniqueRegions.map(region => ({
        key: region ?? "",
        text: region ?? "",
    }));
    

    
}