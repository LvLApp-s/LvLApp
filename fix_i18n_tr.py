import re

js_path = r'static\js\i18n.js'
with open(js_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix Turkish
content = content.replace('community_create_group:"Grup oluştur, "Topluluk Oluştur",', 'community_create_group:"Grup oluştur",\n      community_form_create_btn: "Topluluk Oluştur",')
content = content.replace('community_create_group:"Grup oluştur", "Topluluk Oluştur",', 'community_create_group:"Grup oluştur",\n      community_form_create_btn: "Topluluk Oluştur",')

# Fix English
content = content.replace('community_create_group:"Create group, "Create Community",', 'community_create_group:"Create group",\n      community_form_create_btn: "Create Community",')
content = content.replace('community_create_group:"Create group", "Create Community",', 'community_create_group:"Create group",\n      community_form_create_btn: "Create Community",')

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Replaced strings.")
