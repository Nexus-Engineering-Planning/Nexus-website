import geopandas as gpd
import pandas as pd
import json
import os

os.makedirs('staygis-blog/posts/2025-10-01-nigeria-65', exist_ok=True)

# Sample data (replace with your VIIRS CSV)
data = {
    'city': ['Lagos', 'Abuja'],
    'lon': [3.3792, 7.4951],
    'lat': [6.5244, 9.0579],
    'intensity_2023': [80, 65]
}
df = pd.DataFrame(data)

# Create GeoDataFrame
gdf = gpd.GeoDataFrame(
    df,
    geometry=gpd.points_from_xy(df['lon'], df['lat']),
    crs="EPSG:4326"
)

# Save GeoJSON using to_json()
geojson = json.loads(gdf.to_json())  # Convert to dict
with open('staygis-blog/posts/2025-10-01-nigeria-65/nigeria-night-lights.json', 'w') as f:
    json.dump(geojson, f, indent=2)

print("GeoJSON saved to staygis-blog/posts/2025-10-01-nigeria-65/nigeria-night-lights.json")