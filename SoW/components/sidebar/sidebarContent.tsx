import React from "react";
import { CountryDropdown } from "./countryDropdown";
import { RegionDropdown } from "./regionDropdown";
import { SidebarGrid, GridItem } from "./grid/grid"; 
import { BarChart } from "./visual"; 
import { processProductDataForChart } from "../../utils/ProcessProductData"; 
import { Stack, IColumn, IDropdownOption } from "@fluentui/react";
import { IInputs } from "../../generated/ManifestTypes";
import { 
  sidebarStackStyles, 
  topSectionStyles, 
  dropdownSectionStyles, 
  dropdownItemStyles, 
  middleSectionStyles,
  bottomSectionStyles,
  chartContainerStyles
} from "../../styles";

interface SidebarContentProps {
  countryDropdownOptions: { key: string; text: string }[];
  regionDropdownOptions: { key: string; text: string }[];
  columns: IColumn[];
  items: GridItem[];
  dataset: ComponentFramework.PropertyTypes.DataSet;
  context: ComponentFramework.Context<IInputs>;
  onCountryChange: (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => void;
  onRegionChange: (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => void;
  productData: ComponentFramework.PropertyTypes.DataSet;
  showCountriesWithoutRevenue: boolean;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({
  countryDropdownOptions,
  regionDropdownOptions,
  columns,
  items,
  dataset,
  context,
  onCountryChange,
  onRegionChange,
  productData,
  showCountriesWithoutRevenue,
}) => {
  // Get countryField from the dataset columns
  const countryField = dataset.columns.find(col => col.alias === "CountryField")?.name || "";

  // Process product data for chart
  const productChartData = processProductDataForChart(
    productData, 
    dataset, 
    countryField, 
    showCountriesWithoutRevenue
  );

  return (
      <Stack
        verticalFill 
        styles={sidebarStackStyles}
      >
        {/* Top section: Dropdowns */}
        <Stack.Item styles={topSectionStyles}>
          <Stack horizontal horizontalAlign="stretch" tokens={{ childrenGap: 10 }} styles={dropdownSectionStyles}>
            <Stack.Item styles={dropdownItemStyles}>
              <CountryDropdown
                multiSelect
                options={countryDropdownOptions}
                onChange={onCountryChange}
              />
            </Stack.Item>
  
            <Stack.Item styles={dropdownItemStyles}>
              <RegionDropdown
                multiSelect
                options={regionDropdownOptions}
                onChange={onRegionChange}
              />
            </Stack.Item>
          </Stack>
        </Stack.Item>
  
        {/* Middle section: Grid (allow scroll if needed) */}
        <Stack.Item styles={middleSectionStyles}>
          <SidebarGrid 
            columns={columns} 
            items={items} 
            dataset={dataset} 
            context={context} 
          />
        </Stack.Item>
  
        {/* Bottom section: Bar chart pinned at the bottom */}
        <Stack.Item styles={bottomSectionStyles}>
          <div style={chartContainerStyles}>
            <BarChart data={productChartData} />
          </div>
        </Stack.Item>
      </Stack>
    );
};

