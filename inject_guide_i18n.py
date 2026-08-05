import re

js_path = r'static\js\i18n.js'
with open(js_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_keys = {
    'en': '''
      xp_reward_0_label: "Daily login", xp_reward_0_desc: "Open LvL once per day.",
      xp_reward_1_label: "Create a post", xp_reward_1_desc: "Share a normal profile post.",
      xp_reward_2_label: "Create a community post", xp_reward_2_desc: "Start a post inside a community.",
      xp_reward_3_label: "Write a comment", xp_reward_3_desc: "Reply to another post.",
      xp_reward_4_label: "Receive a comment", xp_reward_4_desc: "Someone comments on your post.",
      xp_reward_5_label: "Give a like", xp_reward_5_desc: "Like another post.",
      xp_reward_6_label: "Receive a like", xp_reward_6_desc: "Someone likes your post.",
      xp_reward_7_label: "Repost", xp_reward_7_desc: "Share another post again.",
      lvl_reward_0_label: "Emoji Kit",
      lvl_reward_1_label: "Rising Medal",
      lvl_reward_2_label: "Avatar Frame",
      lvl_reward_3_label: "Profile Color",
      lvl_reward_4_label: "Mythic Badge",
      lvl_reward_5_label: "App Icon Recolor",
      lvl_roadmap_0_reward: "Default identity", lvl_roadmap_0_type: "Baseline", lvl_roadmap_0_visual: "Black and white profile, standard avatar border, default LvL badge.", lvl_roadmap_0_purpose: "Keeps new accounts clean and makes later color rewards feel earned.",
      lvl_roadmap_1_reward: "Emoji Kit", lvl_roadmap_1_type: "Expression", lvl_roadmap_1_visual: "First emoji/profile expression tools plus the cyan LvL badge color.", lvl_roadmap_1_purpose: "Small visible reward for early activity.",
      lvl_roadmap_2_reward: "Rising Medal", lvl_roadmap_2_type: "Badge", lvl_roadmap_2_visual: "Purple medal styling and a stronger public rank title.", lvl_roadmap_2_purpose: "Shows that the account has moved past beginner status.",
      lvl_roadmap_3_reward: "Avatar Frame", lvl_roadmap_3_type: "Profile", lvl_roadmap_3_visual: "Avatar border styles for profile and feed identity.", lvl_roadmap_3_purpose: "Adds recognition without changing the whole theme too early.",
      lvl_roadmap_4_reward: "Profile Color", lvl_roadmap_4_type: "Customization", lvl_roadmap_4_visual: "Custom profile color for banners, chat headers, and profile accents.", lvl_roadmap_4_purpose: "Unlocks personal color only after enough visible participation.",
      lvl_roadmap_5_reward: "Mythic Badge", lvl_roadmap_5_type: "Prestige", lvl_roadmap_5_visual: "Gold public badge treatment and premium status visuals.", lvl_roadmap_5_purpose: "Rewards long-term activity with a clearly rare look.",
      lvl_roadmap_6_reward: "App Icon Recolor", lvl_roadmap_6_type: "Prestige", lvl_roadmap_6_visual: "First special LvL icon recolor tier for very active members.", lvl_roadmap_6_purpose: "Creates a long-term chase reward without affecting core usability.",
''',
    'tr': '''
      xp_reward_0_label: "Günlük giriş", xp_reward_0_desc: "LvL'i günde bir kez aç.",
      xp_reward_1_label: "Gönderi oluştur", xp_reward_1_desc: "Normal bir profil gönderisi paylaş.",
      xp_reward_2_label: "Topluluk gönderisi oluştur", xp_reward_2_desc: "Bir topluluk içinde gönderi başlat.",
      xp_reward_3_label: "Yorum yaz", xp_reward_3_desc: "Başka bir gönderiye yanıt ver.",
      xp_reward_4_label: "Yorum al", xp_reward_4_desc: "Biri gönderine yorum yapar.",
      xp_reward_5_label: "Beğeni ver", xp_reward_5_desc: "Başka bir gönderiyi beğen.",
      xp_reward_6_label: "Beğeni al", xp_reward_6_desc: "Biri gönderini beğenir.",
      xp_reward_7_label: "Paylaş", xp_reward_7_desc: "Başka bir gönderiyi tekrar paylaş.",
      lvl_reward_0_label: "Emoji Kiti",
      lvl_reward_1_label: "Yükselen Madalya",
      lvl_reward_2_label: "Avatar Çerçevesi",
      lvl_reward_3_label: "Profil Rengi",
      lvl_reward_4_label: "Mistik Rozet",
      lvl_reward_5_label: "Uygulama İkonu Rengi",
      lvl_roadmap_0_reward: "Varsayılan kimlik", lvl_roadmap_0_type: "Temel", lvl_roadmap_0_visual: "Siyah beyaz profil, standart avatar sınırı, varsayılan LvL rozeti.", lvl_roadmap_0_purpose: "Yeni hesapları temiz tutar ve sonraki renk ödüllerinin kazanılmış hissedilmesini sağlar.",
      lvl_roadmap_1_reward: "Emoji Kiti", lvl_roadmap_1_type: "İfade", lvl_roadmap_1_visual: "İlk emoji/profil ifade araçları ve cyan LvL rozet rengi.", lvl_roadmap_1_purpose: "Erken etkinlik için küçük görünür ödül.",
      lvl_roadmap_2_reward: "Yükselen Madalya", lvl_roadmap_2_type: "Rozet", lvl_roadmap_2_visual: "Mor madalya tasarımı ve daha güçlü bir genel rütbe unvanı.", lvl_roadmap_2_purpose: "Hesabın başlangıç seviyesini geçtiğini gösterir.",
      lvl_roadmap_3_reward: "Avatar Çerçevesi", lvl_roadmap_3_type: "Profil", lvl_roadmap_3_visual: "Profil ve akış kimliği için avatar sınırı stilleri.", lvl_roadmap_3_purpose: "Tüm temayı çok erken değiştirmeden tanınırlık ekler.",
      lvl_roadmap_4_reward: "Profil Rengi", lvl_roadmap_4_type: "Özelleştirme", lvl_roadmap_4_visual: "Afişler, sohbet başlıkları ve profil vurguları için özel profil rengi.", lvl_roadmap_4_purpose: "Kişisel rengin kilidini yalnızca yeterli görünür katılım sağlandıktan sonra açar.",
      lvl_roadmap_5_reward: "Mistik Rozet", lvl_roadmap_5_type: "Prestij", lvl_roadmap_5_visual: "Altın genel rozet görünümü ve premium statü görselleri.", lvl_roadmap_5_purpose: "Uzun süreli aktiviteyi nadir görünen bir ödülle ödüllendirir.",
      lvl_roadmap_6_reward: "Uygulama İkonu Rengi", lvl_roadmap_6_type: "Prestij", lvl_roadmap_6_visual: "Çok aktif üyeler için ilk özel LvL ikon rengi seviyesi.", lvl_roadmap_6_purpose: "Temel kullanılabilirliği etkilemeden uzun vadeli bir takip ödülü oluşturur.",
''',
    'ar': '''
      xp_reward_0_label: "تسجيل الدخول اليومي", xp_reward_0_desc: "افتح تطبيق LvL مرة واحدة يومياً.",
      xp_reward_1_label: "إنشاء منشور", xp_reward_1_desc: "شارك منشور شخصي عادي.",
      xp_reward_2_label: "إنشاء منشور في مجتمع", xp_reward_2_desc: "ابدأ منشوراً داخل مجتمع.",
      xp_reward_3_label: "كتابة تعليق", xp_reward_3_desc: "قم بالرد على منشور آخر.",
      xp_reward_4_label: "تلقي تعليق", xp_reward_4_desc: "شخص ما يعلق على منشورك.",
      xp_reward_5_label: "إعطاء إعجاب", xp_reward_5_desc: "أعجب بمنشور آخر.",
      xp_reward_6_label: "تلقي إعجاب", xp_reward_6_desc: "شخص ما يعجب بمنشورك.",
      xp_reward_7_label: "إعادة نشر", xp_reward_7_desc: "شارك منشور شخص آخر مرة أخرى.",
      lvl_reward_0_label: "مجموعة الرموز التعبيرية",
      lvl_reward_1_label: "ميدالية الصعود",
      lvl_reward_2_label: "إطار الصورة الرمزية",
      lvl_reward_3_label: "لون الملف الشخصي",
      lvl_reward_4_label: "شارة أسطورية",
      lvl_reward_5_label: "تلوين أيقونة التطبيق",
      lvl_roadmap_0_reward: "الهوية الافتراضية", lvl_roadmap_0_type: "أساسي", lvl_roadmap_0_visual: "ملف شخصي أبيض وأسود، حد قياسي للصورة الرمزية، شارة LvL افتراضية.", lvl_roadmap_0_purpose: "يحافظ على نظافة الحسابات الجديدة ويجعل مكافآت الألوان اللاحقة تبدو وكأنها مكتسبة.",
      lvl_roadmap_1_reward: "مجموعة الرموز التعبيرية", lvl_roadmap_1_type: "تعبير", lvl_roadmap_1_visual: "أدوات التعبير عن الرموز التعبيرية / الملف الشخصي الأولى بالإضافة إلى لون شارة سماوي.", lvl_roadmap_1_purpose: "مكافأة صغيرة مرئية للنشاط المبكر.",
      lvl_roadmap_2_reward: "ميدالية الصعود", lvl_roadmap_2_type: "شارة", lvl_roadmap_2_visual: "تصميم ميدالية أرجواني وعنوان رتبة عام أقوى.", lvl_roadmap_2_purpose: "يُظهر أن الحساب قد تجاوز حالة المبتدئ.",
      lvl_roadmap_3_reward: "إطار الصورة الرمزية", lvl_roadmap_3_type: "الملف الشخصي", lvl_roadmap_3_visual: "أنماط حدود الصورة الرمزية لهوية الملف الشخصي والخلاصة.", lvl_roadmap_3_purpose: "يضيف التمييز دون تغيير المظهر بالكامل في وقت مبكر جداً.",
      lvl_roadmap_4_reward: "لون الملف الشخصي", lvl_roadmap_4_type: "التخصيص", lvl_roadmap_4_visual: "لون ملف شخصي مخصص للافتات ورؤوس الدردشة ولمسات الملف الشخصي.", lvl_roadmap_4_purpose: "يفتح اللون الشخصي فقط بعد مشاركة مرئية كافية.",
      lvl_roadmap_5_reward: "شارة أسطورية", lvl_roadmap_5_type: "هيبة", lvl_roadmap_5_visual: "معالجة شارة عامة ذهبية ومرئيات الحالة المميزة.", lvl_roadmap_5_purpose: "يكافئ النشاط طويل الأمد بمظهر نادر بوضوح.",
      lvl_roadmap_6_reward: "تلوين أيقونة التطبيق", lvl_roadmap_6_type: "هيبة", lvl_roadmap_6_visual: "أول مستوى خاص لتلوين أيقونة للأعضاء النشطين جداً.", lvl_roadmap_6_purpose: "يخلق مكافأة مطاردة طويلة الأجل دون التأثير على قابلية الاستخدام الأساسية.",
'''
}

for lang in ['en', 'tr', 'ar']:
    pattern = rf'({lang}: {{.*?)(}},|\s*}}\s*}})'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        content = content[:match.end(1)] + new_keys[lang] + content[match.end(1):]

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated i18n.js with Guide list translations.')
