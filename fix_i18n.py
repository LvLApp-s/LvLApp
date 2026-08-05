import re

js_path = r'static\js\i18n.js'
with open(js_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix missing comma before community_form_create_btn
content = re.sub(r'(["\'])\s*community_form_create_btn:', r'\1,\n      community_form_create_btn:', content)

# Fix missing comma before xp_reward_0_label
content = re.sub(r'(["\'])\s*xp_reward_0_label:', r'\1,\n      xp_reward_0_label:', content)

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Syntax fixed.')
