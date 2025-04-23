import * as React from "react";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as atlas from "azure-maps-control";
import { getUniqueCountries, getUniqueRegions } from "./utils/utils";
import { MainComponent } from "./components/main/mainComponent";
import { processProductData } from "./utils/productDataSet";
import { processMapData } from "./utils/ProcessMapData";


type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class SoW implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;

    constructor() {
        console.log("Version: 222");
        console.log("root folder changed");
    }

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const azureMapsKey = context.parameters.AzureMapsKey.raw || "";
        const dataset: DataSet = context.parameters.ViewDataset;
        const polygonField = context.parameters.jsonPolygonField.raw || "";
        const showCountriesWithoutRevenue = context.parameters.ShowCountriesWithOutRevenue?.raw === "true";
        const showCard = context.parameters.ShowCard?.raw || "true";
        const showVisual = context.parameters.ShowVisual?.raw || "true";
        
        // Log ShowVisual and ShowCard settings
        console.log("Configuration settings:");
        console.log("- ShowVisual:", showVisual);
        console.log("- ShowCard:", showCard);
        console.log("- ShowCountriesWithoutRevenue:", showCountriesWithoutRevenue);
        
        const countryField = this.getColumnName(context.parameters.ViewDataset.columns, "CountryField");
        const regionField = this.getColumnName(context.parameters.ViewDataset.columns, "RegionField");
        const currentYearField = this.getColumnName(context.parameters.ViewDataset.columns, "CurrentYearField");
        const lastYearField = this.getColumnName(context.parameters.ViewDataset.columns, "LastYearField");
        const yoYProcentField = this.getColumnName(context.parameters.ViewDataset.columns, "YoYProcentField");
        const RGBAColorOverlay = this.getColumnName(context.parameters.ViewDataset.columns, "RGBAColorOverlay");

        // Process Product dataset
        const productDataset = context.parameters.ProductDataset;
        const productData = processProductData(productDataset) as ComponentFramework.PropertyTypes.DataSet;

        // Get raw opportunity dataset - processing will be done in the map component
        const opportunityDataset = context.parameters.OpportunityDataset;

        const countryDropdownOptions = [
            ...getUniqueCountries(dataset, countryField),
        ];

        const regionDropdownOptions = [
            ...getUniqueRegions(dataset, regionField),
        ];

        const handleCountryChange = (selectedCountry: string | null) => {
        };

        const handleRegionChange = (selectedRegion: string | null) => {
        };

        const geoJsonFeatures = processMapData(dataset, polygonField, RGBAColorOverlay);

        if (!geoJsonFeatures || !Array.isArray(geoJsonFeatures)) {
            console.error("geoJsonFeatures is invalid or not an array:", geoJsonFeatures);
            return React.createElement("div", null, "Loading map data...");
        }

        // Pass data to MainComponent
        return React.createElement(MainComponent, {
            azureMapsKey,
            geoJsonFeatures,
            dataset: dataset,
            context: context,
            polygonField,
            countryField,
            regionField,
            currentYearField,
            lastYearField,
            yoYProcentField,
            countryDropdownOptions,
            regionDropdownOptions,
            RGBAColorOverlay,
            productData,
            opportunityDataset, 
            showCountriesWithoutRevenue,
            showCard: showCard === "true",
            showVisual: showVisual === "true",
            onCountryChange: handleCountryChange,
            onRegionChange: handleRegionChange,
        });
    }

    public destroy(): void {
        console.log("Destroy: PCF control resources cleaned up.");
    }

    private getColumnName(
        columns: ComponentFramework.PropertyHelper.DataSetApi.Column[],
        alias: string
    ): string {
        const column = columns.find(col => col.alias === alias);
        if (!column) {
            console.warn(`Column with alias '${alias}' not found.`);
            return "";
        }
        return column.name;
    }
}
