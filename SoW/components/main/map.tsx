import React, { useEffect, useRef, useState } from "react";
import * as atlas from "azure-maps-control";
import { mapContainerStyles } from "../../styles";
import { InsightCard } from "./card";
import { processOpportunityData } from "../../utils/opportunityDataSet"; // Import the utility

interface MapProps {
    azureMapsKey: string;
    geoJsonFeatures: atlas.data.Feature<atlas.data.Geometry, Record<string, unknown>>[];
    RGBAColorOverlay: string; 
    boundingBox?: atlas.data.BoundingBox;
    opportunityDataset?: ComponentFramework.PropertyTypes.DataSet; // Accept raw dataset
    showCard?: boolean; 
    dataset: ComponentFramework.PropertyTypes.DataSet; // Add dataset prop
    context?: ComponentFramework.Context<any>; // Add context to map props
}

export const Map: React.FC<MapProps> = ({ 
    azureMapsKey, 
    geoJsonFeatures, 
    RGBAColorOverlay, 
    boundingBox, 
    opportunityDataset,
    showCard = true,
    dataset,
    context // Accept context from props
}) => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<atlas.Map | null>(null);
    const dataSource = useRef<atlas.source.DataSource | null>(null);
    const polygonLayer = useRef<atlas.layer.PolygonLayer | null>(null);
    
    // State for processed opportunity data
    const [opportunityData, setOpportunityData] = useState<ComponentFramework.PropertyTypes.DataSet | undefined>(undefined);
    
    // Process opportunity data when the component mounts or when dataset changes
    useEffect(() => {
        if (opportunityDataset) {
            // Use the imported processOpportunityData function
            setOpportunityData(processOpportunityData(opportunityDataset));
        }
    }, [opportunityDataset]);
    
    // State for the insight card
    const [cardVisible, setCardVisible] = useState(false);
    const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
    const [selectedCountry, setSelectedCountry] = useState<string | undefined>(undefined);
    const [selectedSowId, setSelectedSowId] = useState<string | undefined>(undefined);
    
    // Don't show card if showCard is false
    useEffect(() => {
        if (!showCard) {
            setCardVisible(false);
        }
    }, [showCard]);
    
    useEffect(() => {
        if (!mapContainer.current) {
            return;
        }

        if (!mapInstance.current) {
            mapInstance.current = new atlas.Map(mapContainer.current, {
                center: [15.2551, 54.5260], // Center of Europe [longitude, latitude]
                zoom: 3, // Adjust the zoom level for a suitable view of Europe
                authOptions: {
                    authType: atlas.AuthenticationType.subscriptionKey,
                    subscriptionKey: azureMapsKey || "", // Fallback to empty string if null or undefined
                },
            });

            mapInstance.current.events.add("ready", () => {
                // Initialize the data source and add it to the map
                const source = new atlas.source.DataSource();
                dataSource.current = source;
                mapInstance.current?.sources.add(source);

                // Add the PolygonLayer to the map with dynamic coloring
                polygonLayer.current = new atlas.layer.PolygonLayer(source, undefined, {
                    fillColor: [
                        "coalesce",
                        ["get", "fillColor"],  // Look up fillColor in feature.properties
                        "rgba(0,100,255,0.5)"  // Fallback if not specified
                    ],
                    fillOpacity: 0.7, // Slightly transparent to see underlying geography
                    strokeColor: "blue",
                    strokeWidth: 2,
                });
                
                mapInstance.current?.layers.add(polygonLayer.current);

                // Add initial GeoJSON features
                if (geoJsonFeatures && geoJsonFeatures.length > 0) {
                    source.add(geoJsonFeatures);
                }
                
                // Setup mouse events for click and hover interactions
                setupMouseEvents();
            });
        }

        // Cleanup when component unmounts
        return () => {
            mapInstance.current?.dispose();
            mapInstance.current = null;
        };
    }, [azureMapsKey]);

    // Calculate card position based on mouse position and map dimensions
    const calculateCardPosition = (mouseX: number, mouseY: number) => {
        const mapWidth = mapContainer.current?.clientWidth || 0;
        const mapHeight = mapContainer.current?.clientHeight || 0;
        const cardWidth = 400; // Width from styles
        const cardHeight = 400; // Approximate card height
        
        // Ensure card stays within map bounds
        let adjustedX = mouseX + 15; // Offset from cursor
        let adjustedY = mouseY + 15; // Offset from cursor
        
        if (adjustedX + cardWidth > mapWidth) {
            adjustedX = mouseX - cardWidth - 15;
        }
        
        if (adjustedY + cardHeight > mapHeight) {
            adjustedY = mouseY - cardHeight - 15;
        }
        
        return {
            x: Math.max(0, adjustedX),
            y: Math.max(0, adjustedY)
        };
    };

    // Handle card close
    const handleCardClose = () => {
        setCardVisible(false);
        setSelectedCountry(undefined);
    };

    // Setup mouse events for interactions
    const setupMouseEvents = () => {
        if (!mapInstance.current) return;
        
        // Add mouse events for polygon features
        if (polygonLayer.current) {
            // Change cursor on hover to indicate it's clickable
            mapInstance.current.events.add('mouseover', polygonLayer.current, () => {
                mapInstance.current!.getCanvas().style.cursor = 'pointer';
            });
            
            // Restore cursor when not hovering over polygons
            mapInstance.current.events.add('mouseout', polygonLayer.current, () => {
                mapInstance.current!.getCanvas().style.cursor = '';
            });
            
            // Click event to show card
            mapInstance.current.events.add('click', polygonLayer.current, (e) => {
                // Only proceed if showCard is true
                if (!showCard) return;
                
                if (e.shapes && e.shapes[0] && e.position) {
                    // Get country name from feature properties
                    const feature = e.shapes[0] as atlas.Shape;
                    const properties = feature.getProperties();
                    const countryName = properties.name || "Unknown";
                    
                    // Find the SOW record ID for this country
                    let sowRecordId: string | undefined = undefined;
                    dataset.sortedRecordIds.forEach(recordId => {
                        const record = dataset.records[recordId];
                        const recordCountry = record.getNamedReference()?.name;
                        
                        if (recordCountry === countryName) {
                            sowRecordId = recordId;
                            console.log(`Found SOW record for country: ${countryName} (ID: ${sowRecordId})`);
                        }
                    });
                    
                    setSelectedCountry(countryName);
                    setSelectedSowId(sowRecordId); // Set the selected SOW ID
                    
                    // Calculate and set card position
                    const newPosition = calculateCardPosition(e.position[0], e.position[1]);
                    setCardPosition(newPosition);
                    
                    // Show the card
                    setCardVisible(true);
                }
            });
            
            // Click on map (but not on polygon) to hide card
            mapInstance.current.events.add('click', (e) => {
                // Check if click was on a shape
                const features = polygonLayer.current ? 
                    mapInstance.current?.layers.getRenderedShapes(e.position, polygonLayer.current) : 
                    [];
                
                // If clicked on empty map area (not on any shape), hide the card
                if (!features || features.length === 0) {
                    setCardVisible(false);
                    setSelectedCountry(undefined);
                }
            });
        }
    };

    // Watch for changes to geoJsonFeatures and update the data source
    useEffect(() => {
        if (dataSource.current) {
            dataSource.current.clear(); // Clear existing features
            if (geoJsonFeatures && geoJsonFeatures.length > 0) {
                dataSource.current.add(geoJsonFeatures); // Add updated features
            }
        }
    }, [geoJsonFeatures]); // Runs whenever geoJsonFeatures changes

    useEffect(() => {
        if (boundingBox && mapInstance.current) {
            try {
                mapInstance.current.setCamera({
                    bounds: boundingBox,
                    padding: 50, // Optional padding for better visibility
                });
            } catch (error) {
                console.error("Error setting camera to bounding box:", error);
            }
        }
    }, [boundingBox]);

    return (
        <div
            ref={mapContainer}
            style={mapContainerStyles}
            aria-label="Map Container"
        >
            {/* Render the insight card with conditional visibility and pass processed data */}
            <InsightCard
                country={selectedCountry}
                position={cardPosition}
                isVisible={cardVisible && showCard}
                onClose={handleCardClose}
                opportunityData={opportunityData} // Pass processed data
                sowId={selectedSowId}
                context={context} // Pass the context to InsightCard
            />
        </div>
    );
};
