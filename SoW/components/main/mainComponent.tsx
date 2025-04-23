import React, { useEffect, useState } from "react";
import { Stack } from "@fluentui/react"; // Fluent UI components
import { Map } from "../main/map";
import { SidebarContent } from "../sidebar/sidebarContent";
import { stackStyles, mapContainerStyles, sidebarStyles } from "../../styles";
import * as atlas from "azure-maps-control";
import { getGridColumns, mapDatasetToItems, GridItem } from "../sidebar/grid/grid";
import { IColumn, IDropdownOption } from "@fluentui/react";
import { getGeoJsonBoundingBox } from "../../utils/calcBoundingBox"; 
import { IInputs } from "../../generated/ManifestTypes";

interface MainComponentProps {
    azureMapsKey: string;
    geoJsonFeatures: atlas.data.Feature<atlas.data.Geometry, Record<string, unknown>>[]; 
    dataset: ComponentFramework.PropertyTypes.DataSet; 
    context: ComponentFramework.Context<IInputs>;
    polygonField: string; 
    countryField: string; 
    regionField: string;  
    currentYearField: string; 
    lastYearField: string; 
    yoYProcentField: string; 
    RGBAColorOverlay: string;
    countryDropdownOptions: { key: string; text: string }[];
    regionDropdownOptions: { key: string; text: string }[];
    productData: ComponentFramework.PropertyTypes.DataSet;
    opportunityDataset: ComponentFramework.PropertyTypes.DataSet; // Change to opportunityDataset from opportunityData
    showCard: boolean;
    showVisual: boolean;
    onCountryChange: (selectedCountry: string | null) => void;
    onRegionChange: (selectedRegion: string | null) => void;
    showCountriesWithoutRevenue: boolean; 
}

export const MainComponent: React.FC<MainComponentProps> = ({
    azureMapsKey,
    geoJsonFeatures,
    dataset,
    context,
    polygonField,
    countryField,
    regionField,
    currentYearField,
    lastYearField,
    yoYProcentField,
    RGBAColorOverlay,
    countryDropdownOptions,
    regionDropdownOptions,
    productData,
    opportunityDataset, // Use raw dataset instead of processed data
    showCard,
    showVisual,
    showCountriesWithoutRevenue,
    onCountryChange,
    onRegionChange,
}) => {

    // Get columns and items for the grid
    const columns: IColumn[] = getGridColumns();
    
    geoJsonFeatures = React.useMemo(() => {
        console.log("Recomputing geoJsonFeatures...");
        return dataset.sortedRecordIds.map((recordId) => {
            const record = dataset.records[recordId];
            const geoJsonData = record.getValue(polygonField) as string;
            const rowColor = record.getValue(RGBAColorOverlay) as string || null;

            try {
                const parsedGeoJson: GeoJSON.FeatureCollection | GeoJSON.Feature = JSON.parse(geoJsonData);

                if (parsedGeoJson.type === "FeatureCollection" && Array.isArray(parsedGeoJson.features)) {
                    return parsedGeoJson.features.map((feature) => {
                        const props = {
                            ...feature.properties,
                            fillColor: rowColor, // Add row color to features
                        };
                        return new atlas.data.Feature(feature.geometry as atlas.data.Geometry, props);
                    });
                } else if (parsedGeoJson.type === "Feature") {
                    return [
                        new atlas.data.Feature(parsedGeoJson.geometry as atlas.data.Geometry, parsedGeoJson.properties || {}),
                    ];
                }
            } catch (error) {
                console.error("Error parsing GeoJSON for record:", record, error);
            }
            return [];
        }).flat();
    }, [dataset.sortedRecordIds, dataset.records, polygonField, RGBAColorOverlay]);

    const items: GridItem[] = mapDatasetToItems(
        dataset,
        countryField,
        regionField,
        currentYearField,
        lastYearField,
        yoYProcentField,
    );

    const [filteredGeoJsonFeatures, setFilteredGeoJsonFeatures] = useState(geoJsonFeatures);
    const [filteredGridItems, setFilteredGridItems] = useState(items);
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [boundingBox, setBoundingBox] = useState<atlas.data.BoundingBox | undefined>(undefined);

    const updateBoundingBox = (features: atlas.data.Feature<atlas.data.Geometry, Record<string, unknown>>[]) => {
        const bbox = getGeoJsonBoundingBox(features);
        setBoundingBox(bbox);
    };
    
    // Keep the existing effect to reset features when geoJsonFeatures changes
    useEffect(() => {
        setFilteredGeoJsonFeatures(geoJsonFeatures);
      }, [geoJsonFeatures]);
    
      // Handle user toggling a country in multi-select
      const handleCountryDropdownChange = (
        event: React.FormEvent<HTMLDivElement>,
        option?: IDropdownOption
      ) => {
        if (!option) return;
    
        let updatedCountries: string[];
        if (option.selected) {
          // User just selected a new country
          updatedCountries = [...selectedCountries, option.text];
        } else {
          // User just deselected a country
          updatedCountries = selectedCountries.filter((text) => text !== option.text);
        }
    
        setSelectedCountries(updatedCountries);
    
        // Now filter the dataset based on the updated list of countries:
        filterByCountries(updatedCountries);
      };
    
      // Apply the filter logic to map & grid using array of countries
      const filterByCountries = (countries: string[]) => {
        if (countries.length === 0) {
          // If no countries selected, show all
          setFilteredGeoJsonFeatures(geoJsonFeatures);
          setFilteredGridItems(items);
          updateBoundingBox(geoJsonFeatures);
          return;
        }
     
        // Filter the records that have a country in our selected array
        const filteredDataset = dataset.sortedRecordIds
          .map((recordId) => dataset.records[recordId])
          .filter((record) => {
            const countryValue = record.getValue(countryField) as { name: string } | null;
            return countryValue && countries.includes(countryValue.name);
          });
    
        // Build new geoJson features from filtered records
        const filteredFeatures: atlas.data.Feature<atlas.data.Geometry, Record<string, unknown>>[] =
          filteredDataset.flatMap((record) => {
            const geoJsonData = record.getValue(polygonField) as string;
            const rowColor = record.getValue(RGBAColorOverlay) as string || null;

        try {
            const parsedGeoJson: GeoJSON.FeatureCollection | GeoJSON.Feature = JSON.parse(geoJsonData);

            if (parsedGeoJson.type === "FeatureCollection" && Array.isArray(parsedGeoJson.features)) {
            return parsedGeoJson.features.map(f => {
                const props = {
                ...f.properties,
                fillColor: rowColor, 
                };
                return new atlas.data.Feature(f.geometry as atlas.data.Geometry, props);
            });
              } else if (parsedGeoJson.type === "Feature") {
                return [
                  new atlas.data.Feature(parsedGeoJson.geometry as atlas.data.Geometry, parsedGeoJson.properties || {}),
                ];
              }
            } catch (error) {
              console.error("Error parsing GeoJSON for record:", record, error);
            }
            return [];
          });
    
        setFilteredGeoJsonFeatures(filteredFeatures);
    
        // Filter grid items
        const filteredGrid = items.filter((item) => item.country && countries.includes(item.country));
        setFilteredGridItems(filteredGrid);
        updateBoundingBox(filteredFeatures);
      };

    // handleRegionChange

const handleRegionDropdownChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
    if (!option) return;

    let updatedRegions: string[];
    if (option.selected) {
      // user selected a new region
      updatedRegions = [...selectedRegions, option.text];
    } else {
      // user deselected a region
      updatedRegions = selectedRegions.filter((r) => r !== option.text);
    }
    setSelectedRegions(updatedRegions);

    filterByRegions(updatedRegions);
    
  };

  const filterByRegions = (regions: string[]) => {
    if (regions.length === 0) {
      // if no regions selected, show all
      setFilteredGeoJsonFeatures(geoJsonFeatures);
      setFilteredGridItems(items);
      updateBoundingBox(geoJsonFeatures);
      return;
    }

    const filteredDataset = dataset.sortedRecordIds
      .map((recordId) => dataset.records[recordId])
      .filter((record) => {
        const regionValue = record.getValue(regionField) as { name: string } | null;
        return regionValue && regions.includes(regionValue.name);
      });

    const filteredFeatures: atlas.data.Feature<atlas.data.Geometry, Record<string, unknown>>[] = filteredDataset.flatMap(
      (record) => {
        const geoJsonData = record.getValue(polygonField) as string;
        const rowColor = record.getValue(RGBAColorOverlay) as string || null;

      try {
        const parsedGeoJson: GeoJSON.FeatureCollection | GeoJSON.Feature = JSON.parse(geoJsonData);

        if (parsedGeoJson.type === "FeatureCollection" && Array.isArray(parsedGeoJson.features)) {
          return parsedGeoJson.features.map(f => {
            const props = {
              ...f.properties,
              fillColor: rowColor, 
            };
            return new atlas.data.Feature(f.geometry as atlas.data.Geometry, props);
          });
          } else if (parsedGeoJson.type === "Feature") {
            return [new atlas.data.Feature(parsedGeoJson.geometry as atlas.data.Geometry, parsedGeoJson.properties || {})];
          }
        } catch (error) {
          console.error("Error parsing GeoJSON for record:", record, error);
        }
        return [];
      }
    );

    setFilteredGeoJsonFeatures(filteredFeatures);

    // Filter grid
    const filteredGrid = items.filter((item) => item.region && regions.includes(item.region));
    setFilteredGridItems(filteredGrid);
    updateBoundingBox(filteredFeatures);
  };

    return (
        <Stack horizontal styles={stackStyles}>
            <div style={mapContainerStyles}>
                <Map
                    azureMapsKey={azureMapsKey}
                    geoJsonFeatures={filteredGeoJsonFeatures}
                    RGBAColorOverlay={RGBAColorOverlay}
                    boundingBox={boundingBox}
                    opportunityDataset={opportunityDataset} // Pass raw dataset
                    showCard={showCard}
                    dataset={dataset}
                    context={context} // Pass the context to Map component
                />
            </div>
            <div style={sidebarStyles}>
                <SidebarContent
                    countryDropdownOptions={countryDropdownOptions}
                    regionDropdownOptions={regionDropdownOptions}
                    columns={columns}
                    items={filteredGridItems}
                    dataset={dataset}
                    context={context}
                    onCountryChange={handleCountryDropdownChange}
                    onRegionChange={handleRegionDropdownChange}
                    productData={productData} 
                    showCountriesWithoutRevenue={showCountriesWithoutRevenue}
                />
            </div>
        </Stack>
    );
};
