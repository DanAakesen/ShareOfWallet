import React, { useRef, useState, useEffect } from "react";
import { ScrollablePane, Stack, DetailsList, IColumn, StackItem, DetailsListLayoutMode, DetailsRow, SelectionMode } from "@fluentui/react";
import { 
  gridHeaderStyles, 
  gridBodyStyles, 
  parrentGridContainerStyles, 
  gridContainerStyles, 
  totalsRowStyles, 
  trendBoxStyles, 
  trendValueStyles,
  trendBoxContainerStyles, 
  gridDetailListStyles,
  gridRefContainerStyles,
  clickableRowStyles
} from "../../../styles";
import { IInputs } from "../../../generated/ManifestTypes";

export interface GridItem {
    country: string;
    region: string;
    currentYear: number;
    lastYear: number;
    yoYProcent: number;
}

interface GridProps {
    columns: IColumn[];
    items: GridItem[];
    dataset: ComponentFramework.PropertyTypes.DataSet;
    context: ComponentFramework.Context<IInputs>;
}

const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
};

const getTrendBox = (value: number): JSX.Element => {
    let boxStyle = {};
    let iconColor = "";
    let text = "";

    if (value > 5) {
        boxStyle = { ...trendBoxStyles.base, ...trendBoxStyles.green };
        iconColor = "green";
        text = "Increasing";
    } else if (value >= 0 && value <= 5) {
        boxStyle = { ...trendBoxStyles.base, ...trendBoxStyles.orange };
        iconColor = "orange"; 
        text = "Steady";
    } else {
        boxStyle = { ...trendBoxStyles.base, ...trendBoxStyles.red };
        iconColor = "red";
        text = "Declining";
    }

    return (
        <div style={boxStyle}>
            <span
                style={{
                    ...trendBoxStyles.icon,
                    backgroundColor: iconColor,
                }}
            ></span>
            {text}
        </div>
    );
};

// Define grid columns
export const getGridColumns = (): IColumn[] => [
    { key: "country", name: "Country", fieldName: "country", minWidth: 50, maxWidth: 100, isResizable: true },
    { key: "region", name: "Region", fieldName: "region", minWidth: 20, maxWidth: 60, isResizable: true },
    { key: "currentYear", name: "Current Year", fieldName: "currentYear", minWidth: 50, maxWidth: 90, isResizable: true, onRender: (item: GridItem) => formatNumber(item.currentYear) + " $" },
    { key: "lastYear", name: "Last Year", fieldName: "lastYear", minWidth: 50, maxWidth: 90, isResizable: true, onRender: (item: GridItem) => formatNumber(item.lastYear) + " $" },
    { key: "yoYProcent", name: "% Change YoY", fieldName: "yoYProcent", minWidth: 150, maxWidth: 200, isResizable: true, onRender: (item: GridItem) => (
        <div style={trendBoxContainerStyles}>
            <div style={trendValueStyles}>
                {item.yoYProcent.toFixed(2)} %
            </div>
            {getTrendBox(item.yoYProcent)}
        </div>
    ) 
},
];

export const mapDatasetToItems = (
    dataset: ComponentFramework.PropertyTypes.DataSet,
    countryField: string,
    regionField: string,
    currentYearField: string,
    lastYearField: string,
    yoYProcentField: string
): GridItem[] => {
    return dataset.sortedRecordIds.map(recordId => {
        const record = dataset.records[recordId];
        const countryLookup = record.getValue(countryField) as { name: string } | null;
        const regionLookup = record.getValue(regionField) as { name: string } | null;

        return {
            country: countryLookup?.name || "N/A",
            region: regionLookup?.name || "N/A",
            currentYear: record.getValue(currentYearField) as number || 0,
            lastYear: record.getValue(lastYearField) as number || 0,
            yoYProcent: record.getValue(yoYProcentField) as number || 0,
        };
    });
};

const handleItemClick = (
    item: GridItem,
    context: ComponentFramework.Context<IInputs>,
    dataset: ComponentFramework.PropertyTypes.DataSet
) => {
    // Skip if this is the totals row
    if (item.country === "Totals") {
        return;
    }
    
    // Find the primary key column dynamically
    const keyColumn = dataset.columns.find((col) => col.isPrimary);

    if (!keyColumn) {
        console.error("Primary key column not found in the dataset");
        return;
    }

    // Find the specific record that matches the clicked item's country
    const recordId = dataset.sortedRecordIds.find((id) => {
        const record = dataset.records[id];
        const countryValue = record.getValue(dataset.columns.find(col => col.alias === "CountryField")?.name || "");
        
        // Extract country name from the record
        let recordCountry = "";
        if (countryValue && typeof countryValue === "object" && "name" in countryValue) {
            recordCountry = countryValue.name as string;
        }
        
        // Compare with the clicked item's country
        return recordCountry === item.country;
    });

    if (recordId) {
        // Open the form for the record using context.navigation.openForm
        context.navigation.openForm({
            entityName: dataset.getTargetEntityType(), // Get the entity name dynamically
            entityId: recordId,
        });
    } else {
        console.warn("Record ID not found for item:", item);
    }
};

export const SidebarGrid: React.FC<GridProps> = ({ columns, items, dataset, context }) => {
    const gridContainerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [responsiveColumns, setResponsiveColumns] = useState<IColumn[]>(columns);
    const [gridKey, setGridKey] = useState<string>("grid-0");
    
    // Calculate totals
    const totalsRow: GridItem = {
        country: "Totals",
        region: "",
        currentYear: parseFloat(items.reduce((sum, item) => sum + item.currentYear, 0).toFixed(2)),
        lastYear: parseFloat(items.reduce((sum, item) => sum + item.lastYear, 0).toFixed(2)),
        yoYProcent: items.length > 0 
        ? parseFloat((items.reduce((sum, item) => sum + item.yoYProcent, 0) / items.length).toFixed(2)) 
        : 0, 
    };

    // Calculate responsive column widths when container width changes
    useEffect(() => {
        const updateColumnWidths = () => {
            if (gridContainerRef.current) {
                const currentWidth = gridContainerRef.current.clientWidth;
                
                // Only update if width has changed significantly
                if (Math.abs(currentWidth - containerWidth) > 5) {
                    setContainerWidth(currentWidth);
                    
                    if (currentWidth > 0) {
                        // Reserve more space to prevent overflow
                        const reservedSpace = 160;
                        const availableWidth = currentWidth - reservedSpace;
                        
                        // Define relative weights for each column
                        const columnWeights = [0.2, 0.10, 0.2, 0.2, 0.30];
                        
                        // Ensure weights don't exceed 1.0 total
                        const totalWeight = columnWeights.reduce((sum, weight) => sum + weight, 0);
                        const normalizedWeights = columnWeights.map(weight => weight / totalWeight);
                        
                        // Create new columns with calculated widths
                        const newColumns = columns.map((column, index) => {
                            const isLastColumn = index === columns.length - 1;
                            
                            // Calculate default width based on weight
                            let calculatedWidth = Math.max(
                                Math.floor(availableWidth * normalizedWeights[index]), 
                                40
                            );
                            
                            // For last column, ensure it fits within the available space
                            if (isLastColumn) {
                                const usedWidth = columns.slice(0, -1).reduce((sum, col, idx) => {
                                    return sum + Math.floor(availableWidth * normalizedWeights[idx]);
                                }, 0);
                                // Make the last column fit within the remaining space with extra padding
                                const remainingWidth = Math.max(availableWidth - usedWidth - 40, 40);
                                calculatedWidth = remainingWidth;
                            }
                            
                            // Set minimum width lower than calculated to allow resizing smaller
                            const minWidth = Math.max(calculatedWidth * 0.5, 40);
                            
                            return {
                                ...column,
                                key: column.key,
                                name: column.name,
                                fieldName: column.fieldName,
                                minWidth: minWidth,
                                maxWidth: calculatedWidth * 1.5,
                                calculatedWidth: calculatedWidth,
                                currentWidth: calculatedWidth,
                                isResizable: true,
                                onRender: column.onRender
                            };
                        });
                        
                        setResponsiveColumns(newColumns);
                        
                        // Generate a new key to force DetailsList to re-render with new column widths
                        setGridKey(`grid-${Date.now()}`);
                    }
                }
            }
        };

        // Initial update
        updateColumnWidths();
        
        // Set up resize observer
        const resizeObserver = new ResizeObserver(() => {
            window.requestAnimationFrame(updateColumnWidths);
        });
        
        if (gridContainerRef.current) {
            resizeObserver.observe(gridContainerRef.current);
        }
        
        // Add window resize listener
        window.addEventListener('resize', updateColumnWidths);
        
        return () => {
            if (gridContainerRef.current) {
                resizeObserver.unobserve(gridContainerRef.current);
            }
            window.removeEventListener('resize', updateColumnWidths);
        };
    }, [columns, containerWidth]);

    // Prepend totals row
    const itemsWithTotals = [totalsRow, ...items];

    return (
        <Stack grow verticalFill styles={parrentGridContainerStyles}>
            <StackItem grow styles={gridContainerStyles}>
                <div ref={gridContainerRef} style={gridRefContainerStyles}>
                    <ScrollablePane>
                    <DetailsList
                        key={gridKey}
                        items={itemsWithTotals}
                        columns={responsiveColumns}
                        setKey={gridKey}
                        layoutMode={DetailsListLayoutMode.fixedColumns}
                        selectionMode={SelectionMode.none} 
                        onItemInvoked={(item) => handleItemClick(item, context, dataset)} 
                        ariaLabelForSelectionColumn="Toggle selection"
                        checkButtonAriaLabel="Row checkbox"
                        styles={gridDetailListStyles}
                        onRenderRow={(props) => {
                            if (props) {
                                // Apply different styles based on whether it's the totals row
                                const isTotalsRow = props.item.country === "Totals";
                                
                                if (isTotalsRow) {
                                    return (
                                        <DetailsRow
                                            {...props}
                                            styles={totalsRowStyles}
                                        />
                                    );
                                }
                                
                                return (
                                    <DetailsRow
                                        {...props}
                                        styles={clickableRowStyles}
                                    />
                                );
                            }
                            return null;
                        }}
                    />
                    </ScrollablePane>
                </div>
            </StackItem>
        </Stack>
    );
};
