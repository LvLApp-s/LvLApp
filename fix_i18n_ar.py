import re

js_path = r'static\js\i18n.js'
with open(js_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix Arabic
content = content.replace('community_create_group:"إنشاء مجموعة, "إنشاء مجتمع",', 'community_create_group:"إنشاء مجموعة",\n      community_form_create_btn: "إنشاء مجتمع",')
content = content.replace('community_create_group:"إنشاء مجموعة", "إنشاء مجتمع",', 'community_create_group:"إنشاء مجموعة",\n      community_form_create_btn: "إنشاء مجتمع",')

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Replaced Arabic string.")
