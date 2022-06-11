#!/usr/bin/env python3
import json
import sys

# extract only coordinates from geojson

filename = sys.argv[1]
print(f"Opening {filename}")
with open(filename, 'r') as f:
    data = json.load(f)

arr = []
for ent in data["features"]:
    coords = ent["geometry"]["coordinates"][0]
    arr.append(coords)

with open("out.json", "w") as f:
    json.dump(arr, f)

print("Wrote to out.json")
