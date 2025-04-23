import { ChartData } from "chart.js";

// sample dataset
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export const sampleBarChartData: ChartData<"bar"> = {
  labels: ["Denmark", "Norway", "Sweden", "Finland", "United Kingdom"],
  datasets: [
    {
      label: "AMG",
      data: [250000000, 100000000, null, 150000000, 75000000], // Use `null` to skip rendering
      backgroundColor: "rgba(54, 162, 235, 0.6)",
    },
    {
      label: "C&L",
      data: [150000000, 50000000, null, 125000000, null],
      backgroundColor: "rgba(255, 99, 132, 0.2)",
    },
    {
      label: "GM",
      data: [200000000, null, null, null, 125000000],
      backgroundColor: "rgba(255, 159, 64, 0.2)",
    },
    {
      label: "GTRF",
      data: [null, null, 170000000, null, 100000000],
      backgroundColor: "rgba(75, 192, 192, 0.2)",
    },
    {
      label: "GLCM",
      data: [null, null, 80000000, 175000000, null],
      backgroundColor: "rgba(255, 205, 86, 0.2)",
    },
  ],
};


function normalizeCountryName(name: string): string {
  return name.trim();
}

export function processProductDataForChart(
  productData: DataSet, 
  sowDataset: DataSet, 
  countryField: string,
  showCountriesWithoutRevenue: boolean = false // Default to false if not provided
): ChartData<"bar"> {
  const datasets: { label: string; data: number[]; backgroundColor: string }[] = [];
  const productMap: { [productName: string]: { [country: string]: number } } = {};
  const countryNamesSet = new Set<string>();
  const productNames: string[] = [];
  
  // Map of SOW ID to country name
  const sowCountryMap: { [sowId: string]: string } = {};
  
  // Define colors for products to ensure they're consistent across countries
  const colorPalette = [
    "rgba(54, 162, 235, 0.6)",   // blue
    "rgba(255, 99, 132, 0.6)",    // pink
    "rgba(255, 159, 64, 0.6)",    // orange
    "rgba(75, 192, 192, 0.6)",    // green
    "rgba(153, 102, 255, 0.6)",   // purple
    "rgba(255, 205, 86, 0.6)",    // yellow
    "rgba(201, 203, 207, 0.6)"    // grey
  ];

  // First, build a map from SOW ID to country name
  sowDataset.sortedRecordIds.forEach((sowRecordId: string) => {
    const sowRecord = sowDataset.records[sowRecordId];
    const countryValue = sowRecord.getValue(countryField);
    
    let countryName = "";
    if (countryValue && typeof countryValue === "object" && "name" in countryValue) {
      countryName = normalizeCountryName(countryValue.name as string);
    } else if (typeof countryValue === "string") {
      countryName = normalizeCountryName(countryValue);
    } else {
      countryName = normalizeCountryName(sowRecord.getFormattedValue(countryField));
    }
    
    if (countryName) {
      sowCountryMap[sowRecordId] = countryName;
      countryNamesSet.add(countryName);
    }
  });
  
    productData.sortedRecordIds.forEach((recordId: string) => {
    const record = productData.records[recordId];
    
    const sowLookup = record.getValue("SOWLookupField");
    let sowId = "";
    
    if (sowLookup && typeof sowLookup === "object" && "id" in sowLookup) {
      sowId = typeof sowLookup.id === "string" ? 
        sowLookup.id : 
        sowLookup.id.guid || "";
    } else {
      return; 
    }

    const country = sowCountryMap[sowId];
    if (!country) {
      return; // Skip if no country
    }

    const productName = record.getValue("ProductName") as string || "Unknown Product";
    const revenue = record.getValue("Revenue") as number || 0;
    
    if (!productNames.includes(productName)) {
      productNames.push(productName);
    }

    if (!productMap[productName]) {
      productMap[productName] = {};
    }

    if (!productMap[productName][country]) {
      productMap[productName][country] = 0;
    }

    productMap[productName][country] += revenue;
  });

  let labels = Array.from(countryNamesSet);

  if (!showCountriesWithoutRevenue) {
    const countriesWithRevenue = new Set<string>();
    Object.keys(productMap).forEach(productName => {
      Object.keys(productMap[productName]).forEach(country => {
        if (productMap[productName][country] > 0) {
          countriesWithRevenue.add(country);
        }
      });
    });
    
    // Filter labels to only include countries with revenue
    const filteredLabels = labels.filter(country => countriesWithRevenue.has(country));
    
    // Update labels array
    labels = filteredLabels;
  }

  // Create a dataset for each product with consistent colors
  productNames.forEach((productName, index) => {
    const data = new Array(labels.length).fill(null);
    labels.forEach((country, countryIndex) => {
      if (productMap[productName] && country in productMap[productName]) {
        const revenue = productMap[productName][country];
        if (revenue > 0) {
          data[countryIndex] = revenue;
        }
      }
    });
    
    datasets.push({
      label: productName,
      data,
      backgroundColor: colorPalette[index % colorPalette.length] 
    });
  });

  return {
    labels,
    datasets
  };
}
