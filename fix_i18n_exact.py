import json
import re

js_path = r'static\js\i18n.js'
with open(js_path, 'r', encoding='utf-8') as f:
    content = f.read()

# I will find the exact corrupted string and replace it
# The error was: community_create_group:"إنشاء مجموعة, "Create Community",
# Let's fix this specific line in the content by matching it and replacing it
fixed_content = content.replace('community_create_group:"إنشاء مجموعة, "Create Community",', 'community_create_group:"إنشاء مجموعة",\n      community_form_create_btn: "Create Community",')

# Write back
with open(js_path, 'w', encoding='utf-8') as f:
    f.write(fixed_content)

print("Attempted specific string replacement.")
