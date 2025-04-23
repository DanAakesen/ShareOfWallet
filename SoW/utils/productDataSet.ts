type DataSet = ComponentFramework.PropertyTypes.DataSet;

interface ProductRecord {
    sowId: string;
    name: string;
    revenue: number;
}

export function processProductData(productDataset: DataSet): DataSet {
    if (productDataset.loading) {
        return productDataset;
    }

    if (productDataset.error) {
        return productDataset;
    }

    const validRecords: { [id: string]: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord } = {};

    productDataset.sortedRecordIds.forEach(productId => {
        const productRecord = productDataset.records[productId];

        // Extract Product Name
        const productName = productRecord.getValue("ProductName") as string || "";

        // Extract Product Revenue (ensure it's a number)
        const productRevenue = productRecord.getValue("Revenue") as number || 0;

        // Extract SOW Lookup Field
        const sowLookup = productRecord.getValue("SOWLookupField");
        let sowId: string | null = null;

        if (sowLookup && typeof sowLookup === "object" && "id" in sowLookup) {
            sowId = typeof sowLookup.id === "string" ? sowLookup.id : sowLookup.id.guid;
        }

        // Ensure only products with valid SOW IDs are included
        if (sowId) {
            validRecords[productId] = {
                getFormattedValue: (columnName: string) => {
                    switch (columnName) {
                        case "ProductName":
                            return productName;
                        case "Revenue":
                            return productRevenue.toString();
                        case "SOWLookupField":
                            return sowId || "";
                        default:
                            return "";
                    }
                },
                getRecordId: () => productId,
                getValue: (columnName: string) => {
                    switch (columnName) {
                        case "ProductName":
                            return productName;
                        case "Revenue":
                            return productRevenue;
                        case "SOWLookupField":
                            return { id: sowId || "", name: productName, entityType: "sow" };
                        default:
                            return "";
                    }
                },
                getNamedReference: () => {
                    return { id: { guid: sowId as string }, name: productName, entityType: "sow" };
                }
            };
        }
    });

    return {
        ...productDataset,
        records: validRecords,
        sortedRecordIds: Object.keys(validRecords),
    };
}
