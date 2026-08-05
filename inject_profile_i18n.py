import re

js_path = r'static\js\i18n.js'
with open(js_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_keys = {
    'en': '''
      profile_xp_this_level: "XP this level",
      profile_xp_to_lvl: "XP to LvL",
      profile_public_progress: "Public progress",
      profile_unlocked: "Unlocked",
      profile_locked: "Locked",
      achievement_first_post_name: "First Post", achievement_first_post_desc: "Share your first post.",
      achievement_active_poster_name: "Active Poster", achievement_active_poster_desc: "Share 5 posts.",
      achievement_conversation_starter_name: "Conversation Starter", achievement_conversation_starter_desc: "Write 10 comments.",
      achievement_known_member_name: "Known Member", achievement_known_member_desc: "Reach 5 followers.",
      achievement_squad_builder_name: "Squad Builder", achievement_squad_builder_desc: "Connect with 3 friends.",
      achievement_xp_collector_name: "XP Collector", achievement_xp_collector_desc: "Earn 1,000 total XP.",
      achievement_rising_member_name: "Rising Member", achievement_rising_member_desc: "Reach LvL 5.",
      achievement_hero_status_name: "Hero Status", achievement_hero_status_desc: "Reach LvL 10.",
''',
    'tr': '''
      profile_xp_this_level: "Bu seviyede XP",
      profile_xp_to_lvl: "Sonraki LvL için XP",
      profile_public_progress: "Genel İlerleme",
      profile_unlocked: "Açık",
      profile_locked: "Kilitli",
      achievement_first_post_name: "İlk Gönderi", achievement_first_post_desc: "İlk gönderini paylaş.",
      achievement_active_poster_name: "Aktif Paylaşımcı", achievement_active_poster_desc: "5 gönderi paylaş.",
      achievement_conversation_starter_name: "Sohbet Başlatıcı", achievement_conversation_starter_desc: "10 yorum yaz.",
      achievement_known_member_name: "Tanınan Üye", achievement_known_member_desc: "5 takipçiye ulaş.",
      achievement_squad_builder_name: "Ekip Kurucu", achievement_squad_builder_desc: "3 arkadaş edin.",
      achievement_xp_collector_name: "XP Toplayıcı", achievement_xp_collector_desc: "Toplam 1.000 XP kazan.",
      achievement_rising_member_name: "Yükselen Üye", achievement_rising_member_desc: "LvL 5'e ulaş.",
      achievement_hero_status_name: "Kahraman", achievement_hero_status_desc: "LvL 10'a ulaş.",
''',
    'ar': '''
      profile_xp_this_level: "نقاط هذا المستوى",
      profile_xp_to_lvl: "للمستوى",
      profile_public_progress: "التقدم العام",
      profile_unlocked: "مفتوح",
      profile_locked: "مغلق",
      achievement_first_post_name: "المنشور الأول", achievement_first_post_desc: "شارك أول منشور لك.",
      achievement_active_poster_name: "ناشر نشط", achievement_active_poster_desc: "شارك 5 منشورات.",
      achievement_conversation_starter_name: "مبتدئ المحادثات", achievement_conversation_starter_desc: "اكتب 10 تعليقات.",
      achievement_known_member_name: "عضو معروف", achievement_known_member_desc: "احصل على 5 متابعين.",
      achievement_squad_builder_name: "باني الفريق", achievement_squad_builder_desc: "تواصل مع 3 أصدقاء.",
      achievement_xp_collector_name: "جامع النقاط", achievement_xp_collector_desc: "اربح 1,000 نقطة.",
      achievement_rising_member_name: "عضو صاعد", achievement_rising_member_desc: "صل إلى المستوى 5.",
      achievement_hero_status_name: "بطل", achievement_hero_status_desc: "صل إلى المستوى 10.",
'''
}

for lang in ['en', 'tr', 'ar']:
    # Instead of regex that might fail, I'll find the closing brace for each language
    # using string manipulation.
    # Pattern to match: }, or } } at the end of the language block
    match = re.search(rf'({lang}: {{.*?)(}},|\s*}}\s*}})', content, re.DOTALL)
    if match:
        # Before appending new_keys, make sure there's a trailing comma before it.
        preceding_text = content[:match.end(1)].rstrip()
        if not preceding_text.endswith(','):
            preceding_text += ','
        content = preceding_text + "\n" + new_keys[lang] + content[match.end(1):]

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Injected successfully.")
