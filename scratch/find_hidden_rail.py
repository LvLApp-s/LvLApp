import os
import glob
import re

css_dir = r"c:\Users\Rojin\Desktop\lvl\social-media-main\static\css\sections"
css_files = glob.glob(os.path.join(css_dir, "*.css"))

for file_path in css_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Split by media queries
    parts = content.split("@media")
    for part in parts[1:]: # Skip the first part which is before any @media
        # Find the media query condition
        query_end = part.find("{")
        query = part[:query_end].strip()
        
        # Check if this media block hides left-rail-wrapper
        if "left-rail-wrapper" in part and "display: none" in part:
            # Let's extract the block to see if it specifically targets left-rail-wrapper
            print(f"File: {os.path.basename(file_path)}")
            print(f"Media Query: {query}")
            print("---")
