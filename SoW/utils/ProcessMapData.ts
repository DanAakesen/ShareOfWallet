import * as atlas from "azure-maps-control";

type DataSet = ComponentFramework.PropertyTypes.DataSet;

/**
 * Processes the dataset to create map features with colors from RGBAColorOverlay
 * @param dataset The dataset containing geographic data 
 * @param polygonField The field name containing polygon GeoJSON data
 * @param RGBAColorOverlay The field name containing color data
 * @returns Array of Atlas Map Features
 */
export function processMapData(
    dataset: DataSet,
    polygonField: string,
    RGBAColorOverlay: string
): atlas.data.Feature<atlas.data.Geometry, Record<string, unknown>>[] {
    const features: atlas.data.Feature<atlas.data.Geometry, Record<string, unknown>>[] = [];
    dataset.sortedRecordIds.forEach(recordId => {
        const record = dataset.records[recordId];
        const geoJsonData = record.getValue(polygonField);
        const rowColor = record.getValue(RGBAColorOverlay) as string | null; 

        if (geoJsonData) {
            try {
                const parsedGeoJson: GeoJSON.FeatureCollection | GeoJSON.Feature = JSON.parse(geoJsonData as string);

                if (parsedGeoJson.type === "FeatureCollection" && Array.isArray(parsedGeoJson.features)) {
                    parsedGeoJson.features.forEach((feature: GeoJSON.Feature) => {
                        if (
                            feature.geometry &&
                            (feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon")
                        ) {
                            const props = {
                                ...feature.properties,
                                fillColor: rowColor,  
                            };
                            
                            features.push(
                                new atlas.data.Feature(
                                    feature.geometry as atlas.data.Geometry,
                                    props
                                )
                            );
                        }
                    });
                } else if (
                    parsedGeoJson.type === "Feature" &&
                    parsedGeoJson.geometry &&
                    (parsedGeoJson.geometry.type === "Polygon" || parsedGeoJson.geometry.type === "MultiPolygon")
                ) {
                    const props = {
                        ...parsedGeoJson.properties,
                        fillColor: rowColor,
                      };
                    
                    features.push(
                        new atlas.data.Feature(
                            parsedGeoJson.geometry as atlas.data.Geometry,
                            props
                        )
                    );
                }
            } catch (error) {
                console.error("Error parsing GeoJSON data:", error);
            }
        }
    });
    return features;
}