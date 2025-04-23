import * as atlas from "azure-maps-control";

export const getGeoJsonBoundingBox = (
    features: atlas.data.Feature<atlas.data.Geometry, Record<string, unknown>>[]
): atlas.data.BoundingBox | undefined => {
    if (!features || features.length === 0) return undefined;

    let minLon = Infinity, minLat = Infinity, maxLon = -Infinity, maxLat = -Infinity;

    features.forEach((feature) => {
        const geometry = feature.geometry;

        if (geometry.type === "Polygon" || geometry.type === "MultiPolygon") {
            const coordinates = geometry.type === "Polygon"
                ? geometry.coordinates as atlas.data.Position[][]
                : geometry.coordinates.flat() as atlas.data.Position[][];

            coordinates.forEach((ring) => {
                ring.forEach(([lon, lat]) => {
                    if (lon < minLon) minLon = lon;
                    if (lat < minLat) minLat = lat;
                    if (lon > maxLon) maxLon = lon;
                    if (lat > maxLat) maxLat = lat;
                });
            });
        }
    });

    return [minLon, minLat, maxLon, maxLat] as atlas.data.BoundingBox;
};

