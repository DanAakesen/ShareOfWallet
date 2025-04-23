import React from 'react';

type DataSet = ComponentFramework.PropertyTypes.DataSet;
type EntityReference = { id: string | { guid: string }, name?: string, entityType?: string };

export function processOpportunityData(opportunityDataset: DataSet): DataSet {
    // Check if data is still loading
    if (!opportunityDataset || opportunityDataset.loading) {
        console.warn("Opportunity dataset is loading or not available");
        return opportunityDataset;
    }

    // Check for errors
    if (opportunityDataset.error) {
        console.error("Error in opportunity dataset:", opportunityDataset.error);
        return opportunityDataset;
    }
    
    const validRecords: { [id: string]: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord } = {};
    let validCount = 0;
    let invalidCount = 0;
    let sowLookupMissingCount = 0;
    
    // Process each opportunity record
    opportunityDataset.sortedRecordIds.forEach((recordId) => {
        try {
            const record = opportunityDataset.records[recordId];
            
            if (!record) {
                console.warn(`Record ${recordId} exists in sortedRecordIds but not in records object`);
                invalidCount++;
                return;
            }

            // Extract core fields for validation
            const sowLookup = record.getValue("OppToSOWLookupField");
            
            // Check for SOW ID in lookup field
            let hasSowReference = false;
            if (sowLookup !== null && typeof sowLookup === "object") {
                if ("id" in sowLookup || "name" in sowLookup) {
                    hasSowReference = true;
                }
            }
            
            // Count records with missing SOW lookups
            if (!hasSowReference) {
                sowLookupMissingCount++;
            }

            // Keep all records, even without SOW ID
            validRecords[recordId] = record;
            validCount++;
            
        } catch (error) {
            console.error(`Error processing opportunity record ${recordId}:`, error);
            invalidCount++;
        }
    });

    if (invalidCount > 0) {
        console.warn(`${invalidCount} invalid records found during opportunity processing`);
    }
    
    if (sowLookupMissingCount > 0) {
        console.warn(`${sowLookupMissingCount} records missing SOW lookup reference`);
    }

    // Return the dataset with valid records
    return {
        ...opportunityDataset,
        records: validRecords,
        sortedRecordIds: Object.keys(validRecords),
    };
}

/**
 * Handle clicking on an opportunity to open it in a modal
 */
export const handleOpportunityClick = (
  opportunityId: string,
  opportunityData: ComponentFramework.PropertyTypes.DataSet | undefined,
  setSelectedRecordId: (id: string | undefined) => void,
  setSelectedEntityType: (type: string | undefined) => void,
  setModalOpen: (isOpen: boolean) => void
): void => {
  if (!opportunityData) return;
  
  try {
    // Get entity type from dataset
    const entityType = opportunityData.getTargetEntityType?.() || "opportunity";
    
    // Set the state to open the modal directly
    setSelectedRecordId(opportunityId);
    setSelectedEntityType(entityType);
    setModalOpen(true);
    
  } catch (error) {
    console.error("Error handling opportunity click:", error);
  }
};

/**
 * Process opportunities by year for the opportunity chart
 */
export const processOpportunitiesByYear = (
  wonOpportunities: any[],
  lostOpportunities: any[]
): { yearData: any[], maxCount: number } => {
  const opportunitiesByYear: {
    [year: number]: { 
      won: number; 
      lost: number; 
      totalWonRevenue: number;
      totalLostRevenue: number;
    }
  } = {};
  
  // Extract unique years from all opportunities (won and lost)
  const allOpportunities = [...wonOpportunities, ...lostOpportunities];
  
  // Handle case with no opportunities
  if (allOpportunities.length === 0) {
    return { yearData: [], maxCount: 0 };
  }
  
  // Process opportunities to group by year
  allOpportunities.forEach(opp => {
    // Extract year from the closeDate
    let year: number | null = null;
    if (opp.closeDate) {
      const dateParts = opp.closeDate.split('/');
      if (dateParts.length > 0) {
        // Try to get year from last part (assumed format: DD/MM/YYYY)
        const lastPart = dateParts[dateParts.length - 1];
        if (lastPart && lastPart.length >= 4) {
          year = parseInt(lastPart.substring(0, 4), 10);
        }
      }
    }
    
    // Skip if no valid year
    if (!year || isNaN(year)) return;
    
    // Initialize year data if not exists
    if (!opportunitiesByYear[year]) {
      opportunitiesByYear[year] = { 
        won: 0, 
        lost: 0, 
        totalWonRevenue: 0,
        totalLostRevenue: 0
      };
    }
    
    // Increment count based on status
    const isWon = wonOpportunities.includes(opp);
    if (isWon) {
      opportunitiesByYear[year].won++;
      opportunitiesByYear[year].totalWonRevenue += opp.revenue;
    } else {
      opportunitiesByYear[year].lost++;
      opportunitiesByYear[year].totalLostRevenue += opp.revenue;
    }
  });
  
  // Convert to array and sort by year
  const yearData = Object.entries(opportunitiesByYear)
    .map(([year, data]) => ({
      year: parseInt(year, 10),
      ...data,
      total: data.won + data.lost,
      winRate: data.won > 0 ? Math.round((data.won / (data.won + data.lost)) * 100) : 0
    }))
    .sort((a, b) => a.year - b.year);
  
  // Find max count for Y-axis scaling
  const maxCount = Math.max(...yearData.map(d => d.won + d.lost));
  
  return { yearData, maxCount };
};

/**
 * Filter opportunities by status
 */
export const getActiveOpportunities = (countryOpportunities: any[]): any[] => {
  return countryOpportunities.filter(opp => {
    // Status 1 or 2 or "1" or "2" means "Active/Open"
    if (opp.status === 1 || opp.status === 2 || 
        opp.status === "1" || opp.status === "2" || 
        (typeof opp.status === "object" && opp.status && 
         ("value" in opp.status) && 
         ([1, 2].includes(opp.status.value)))) {
      return true;
    }
    return false;
  });
};

/**
 * Filter opportunities by won status
 */
export const getWonOpportunities = (countryOpportunities: any[]): any[] => {
  return countryOpportunities.filter(opp => {
    // Status 3 or "3" means "Won"
    return opp.status === 3 || opp.status === "3" || 
           (typeof opp.status === "object" && opp.status && 
            ("value" in opp.status) && opp.status.value === 3);
  });
};

/**
 * Filter opportunities by lost status
 */
export const getLostOpportunities = (countryOpportunities: any[]): any[] => {
  return countryOpportunities.filter(opp => {
    // Status 4 or 5 or "4" or "5" means "Lost"
    return opp.status === 4 || opp.status === 5 || 
           opp.status === "4" || opp.status === "5" || 
           (typeof opp.status === "object" && opp.status && 
            ("value" in opp.status) && 
            ([4, 5].includes(opp.status.value)));
  });
};

/**
 * Filter outlier opportunities from active opportunities
 */
export const getOutlierOpportunities = (activeOpportunities: any[]): any[] => {
  return activeOpportunities.filter(opp => {
    // Check for string "1" since that's what we're seeing in the logs
    return opp.isOutlier === "1";
  });
};

/**
 * Get predicted win opportunities from active opportunities
 */
export const getPredictedWinOpportunities = (activeOpportunities: any[]): any[] => {
  return activeOpportunities.filter(opp => {
    // Check for number 1 or string "1" since data types might vary
    return opp.predictedOutcome === 1 || opp.predictedOutcome === "1";
  });
};

/**
 * Helper function to parse decimal values that might use comma or period as separator
 * and convert values in the range 0-1 to percentages (0-100)
 */
export const parseDecimalValue = (value: any): number => {
  if (typeof value === 'number') {
    // If already a number, convert to percentage if in 0-1 range
    return value <= 1 ? value * 100 : value;
  } else if (typeof value === 'string') {
    // Handle string values with either comma or period
    const normalizedValue = value.replace(',', '.'); // Convert comma to period
    const numericValue = parseFloat(normalizedValue);
    // Convert to percentage if in 0-1 range
    return !isNaN(numericValue) ? (numericValue <= 1 ? numericValue * 100 : numericValue) : 0;
  }
  return 0;
};

/**
 * Helper function to group opportunities by year and sum revenues
 */
export const processOpportunitiesForChart = (opportunities: any[]): {[year: number]: number} => {
  const oppsByYear: {[year: number]: number} = {};
  
  opportunities.forEach(opp => {
    if (!opp.closeDate || !opp.revenue) return;
    
    // Parse date string to get year
    try {
      const year = new Date(opp.closeDate).getFullYear();
      
      // Only process years that make sense (between 2000-2050)
      if (year >= 2000 && year <= 2050) {
        if (!oppsByYear[year]) {
          oppsByYear[year] = 0;
        }
        oppsByYear[year] += opp.revenue;
      }
    } catch (err) {
      console.warn("Error parsing date:", opp.closeDate);
    }
  });
  
  return oppsByYear;
};

/**
 * Get confidence level text and status based on a numeric confidence value
 */
export const getOutlierConfidenceLevel = (outlierConfidence: number): { text: string, isLow: boolean } => {
  if (outlierConfidence >= 90) {
    return { text: "High", isLow: false };
  } else if (outlierConfidence < 50) {
    return { text: "Low", isLow: true };
  } else {
    return { text: "Medium", isLow: false };
  }
};

/**
 * Calculates a trend line based on revenue data points
 * @param wonData Object with years as keys and revenue as values for won opportunities
 * @param predictedData Object with years as keys and revenue as values for predicted opportunities
 * @returns Array of data points for the trend line with year and revenue
 */
export const calculateTrendLine = (
  wonData: {[year: number]: number},
  predictedData: {[year: number]: number}
): Array<{year: number, revenue: number}> => {
  // Combine all years from both datasets
  const years = [
    ...Object.keys(wonData).map(Number),
    ...Object.keys(predictedData).map(Number)
  ].sort((a, b) => a - b);
  
  // If there are less than 2 data points, we can't calculate a meaningful trend
  if (years.length < 2) {
    return years.map(year => ({
      year,
      revenue: wonData[year] || predictedData[year] || 0
    }));
  }
  
  // Get the first and last year
  const firstYear = years[0];
  const lastYear = years[years.length - 1];
  
  // Collect all revenue data points
  const dataPoints: Array<{year: number, revenue: number}> = [];
  years.forEach(year => {
    if (wonData[year]) {
      dataPoints.push({ year, revenue: wonData[year] });
    }
    if (predictedData[year]) {
      dataPoints.push({ year, revenue: predictedData[year] });
    }
  });
  
  // Calculate average revenue
  const totalRevenue = dataPoints.reduce((sum, point) => sum + point.revenue, 0);
  const averageRevenue = totalRevenue / dataPoints.length;
  
  // Calculate the average rate of change using linear regression
  // For simplicity, using first and last year as reference points
  const firstYearRevenue = 
    (wonData[firstYear] !== undefined) ? wonData[firstYear] : 
    (predictedData[firstYear] !== undefined) ? predictedData[firstYear] : 
    averageRevenue;
    
  const lastYearRevenue = 
    (wonData[lastYear] !== undefined) ? wonData[lastYear] : 
    (predictedData[lastYear] !== undefined) ? predictedData[lastYear] : 
    averageRevenue;
  
  const yearSpan = lastYear - firstYear;
  
  if (yearSpan === 0) {
    // If we only have a single year, return flat trend line at the average
    return [
      { year: firstYear, revenue: averageRevenue },
      { year: lastYear, revenue: averageRevenue }
    ];
  }
  
  // Calculate the slope and intercept for the trend line (y = mx + b)
  const slope = (lastYearRevenue - firstYearRevenue) / yearSpan;
  const intercept = firstYearRevenue - (slope * firstYear);
  
  // Generate trend line points for each year
  const trendLine = years.map(year => ({
    year,
    revenue: (slope * year) + intercept
  }));
  
  return trendLine;
};

/**
 * Helper function to format currency
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Helper function to get probability color
 */
export const getProbabilityColor = (probability: number, colors: any): string => {
  if (probability >= 75) {
    return colors.green;
  } else if (probability >= 50) {
    return colors.purple;
  } else if (probability >= 25) {
    return colors.blue;
  } else {
    return colors.lightBlue;
  }
};

/**
 * Process opportunities matching a specific SOW ID from the dataset
 * @param opportunityData The dataset containing all opportunities
 * @param sowId The SOW ID to match
 * @param country The country name to match as fallback
 * @returns Array of processed opportunity objects
 */
export const processOpportunitiesForSow = (
  opportunityData: ComponentFramework.PropertyTypes.DataSet | undefined,
  sowId: string | undefined,
  country: string | undefined
): any[] => {
  if (!opportunityData || !sowId) {
    return [];
  }
  
  try {
    const opportunities: any[] = [];
    
    // Find opportunities matching this SOW ID
    opportunityData.sortedRecordIds.forEach(recordId => {
      const record = opportunityData.records[recordId];
      const sowLookup = record.getValue("OppToSOWLookupField");
      let isMatch = false;
      
      if (!sowLookup || typeof sowLookup !== "object") {
        return;
      }
      
      // Try to match by ID
      if ("id" in sowLookup) {
        // String ID direct match
        if (typeof sowLookup.id === "string" && sowLookup.id === sowId) {
          isMatch = true;
        }
        
        // GUID object match
        if (typeof sowLookup.id === "object" && sowLookup.id !== null && 
            "guid" in sowLookup.id && sowLookup.id.guid === sowId) {
          isMatch = true;
        }
      }
      
      // Try to match by name if ID match failed
      if (!isMatch && "name" in sowLookup && country && sowLookup.name === country) {
        isMatch = true;
      }
      
      // If we found a match, add this opportunity to our list
      if (isMatch) {
        const name = record.getValue("OpportunityName") as string || "Unnamed Opportunity";
        const revenue = record.getValue("OppRevenue") as number || 0;
        const probability = record.getValue("Probability") as number || 0;
        const closeDate = record.getValue("CloseDate") as Date || null;
        const winLoss = record.getValue("WinLossRatio") as number || 0;
        const status = record.getValue("Status") as number || null;
        // For a boolean field in Dataverse, the value is likely to be 1 for true, 0 for false
        const isOutlier = record.getValue("IsOutlier") as number || 0;
        // Update PredictedOutcome to handle as a number (Whole.None)
        const predictedOutcome = record.getValue("PredictedOutcome") as number || 0;
        // Get raw values for confidence fields (could be number or string)
        const rawPredictionConfidence = record.getValue("PredictionConfidence");
        const rawOutlierConfidence = record.getValue("OutlierConfidence");
        // Parse confidence values and normalize to percentage (0-100)
        const predictionConfidence = parseDecimalValue(rawPredictionConfidence);
        const outlierConfidence = parseDecimalValue(rawOutlierConfidence);
        
        // Format date for display
        let formattedDate = "";
        if (closeDate) {
          try {
            formattedDate = new Date(closeDate).toLocaleDateString();
          } catch {
            formattedDate = "Invalid date";
          }
        }
        
        opportunities.push({
          id: recordId,
          name,
          revenue,
          probability,
          closeDate: formattedDate,
          winLossRatio: winLoss,
          status,
          isOutlier,  // Store the raw isOutlier value
          predictedOutcome, // Now a number (1 = predicted win)
          predictionConfidence, // Normalized to 0-100 range
          outlierConfidence // Normalized to 0-100 range
        });
      }
    });
    
    // Sort opportunities by revenue (highest first)
    opportunities.sort((a, b) => b.revenue - a.revenue);
    
    return opportunities;
    
  } catch (error) {
    console.error("Error processing opportunity data:", error);
    return [];
  }
};
