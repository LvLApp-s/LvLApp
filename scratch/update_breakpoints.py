import os
import glob

# Path to the CSS sections directory
css_dir = r"c:\Users\Rojin\Desktop\lvl\social-media-main\static\css\sections"

css_files = glob.glob(os.path.join(css_dir, "*.css"))

for file_path in css_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Replace the exact media query breakpoints
    # We replace 991px with 767px (mobile portrait/landscape max)
    # We replace 992px with 768px (tablet portrait/landscape min)
    new_content = content.replace("991px", "767px").replace("992px", "768px")

    if content != new_content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated {os.path.basename(file_path)}")

print("Done updating CSS breakpoints.")
