import re

js_path = r'static\js\i18n.js'
with open(js_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_keys = {
    'en': '''
      level_title_new_adventurer: "New Adventurer",
      level_title_rising_star: "Rising Star",
      level_title_lvl_pro: "LvL Pro",
      level_title_elite_champion: "Elite Champion",
      level_title_mythic_legend: "Mythic Legend",
      level_title_server_icon: "Server Icon",
''',
    'tr': '''
      level_title_new_adventurer: "Yeni Maceracı",
      level_title_rising_star: "Yükselen Yıldız",
      level_title_lvl_pro: "LvL Uzmanı",
      level_title_elite_champion: "Elit Şampiyon",
      level_title_mythic_legend: "Efsane",
      level_title_server_icon: "Sunucu İkonu",
''',
    'ar': '''
      level_title_new_adventurer: "مغامر جديد",
      level_title_rising_star: "نجم صاعد",
      level_title_lvl_pro: "محترف المستوى",
      level_title_elite_champion: "بطل النخبة",
      level_title_mythic_legend: "أسطورة",
      level_title_server_icon: "أيقونة السيرفر",
'''
}

for lang in ['en', 'tr', 'ar']:
    match = re.search(rf'({lang}: {{.*?)(}},|\s*}}\s*}})', content, re.DOTALL)
    if match:
        preceding_text = content[:match.end(1)].rstrip()
        if not preceding_text.endswith(','):
            preceding_text += ','
        content = preceding_text + "\n" + new_keys[lang] + content[match.end(1):]

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(content)
