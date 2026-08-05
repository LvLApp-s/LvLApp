import re

js_path = r'static\js\i18n.js'
with open(js_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_keys = {
    'en': '''
      guide_header_desc: "Earn XP, unlock profile style, and make your progress visible without reading a rule book.",
      verification_submit_title: "Submit Verification Request",
      verification_submit_desc: "Please provide proof of identity, such as links to official websites or document uploads, and state why your account should be verified.",
      settings_username_hint: "3-24 letters, numbers, or underscores. Usernames are saved lowercase.",
      settings_bio_placeholder: "Tell us about yourself...",
      settings_location_placeholder: "City, Country",
      settings_photo_hint: "Upload JPG, PNG, GIF, or WebP up to 5 MB.",
      settings_remove_photo: "Remove current photo and use the default avatar",
      settings_banner_hint: "Changes the banner on your profile and the color used for your chat header.",
      settings_banner_locked_hint: "Profile colors unlock at LvL 20. Until then, accounts stay black and white so reward colors stay meaningful.",
      settings_banner_earn_xp: "Earn XP by posting, commenting, liking, and joining conversations.",
      settings_banner_see_table: "See the LvL reward table.",
      settings_delete_prefix: "Type",
      settings_delete_suffix: "to confirm",
      achievement_elite_champion_name: "Elite Champion", achievement_elite_champion_desc: "Reach LvL 20.",
      achievement_mythic_legend_name: "Mythic Legend", achievement_mythic_legend_desc: "Reach LvL 30.",
      activity_kicker: "Your history",
      activity_title: "Activity",
      activity_desc: "Posts, replies, likes, reposts, and clips you touched recently.",
      activity_empty_title: "Nothing here yet",
      activity_empty_desc: "Post, comment, like, repost, or upload a reel to build your LvL history.",
      activity_type_post: "Post",
      activity_type_comment: "Comment",
      activity_type_like: "Like",
      activity_type_repost: "Repost",
      activity_type_reel: "Reel",
      activity_desc_picture: "Picture post",
      activity_desc_like: "You liked a post.",
      activity_desc_repost: "You reposted something to your network.",
      activity_desc_reel: "You uploaded a reel.",
''',
    'tr': '''
      guide_header_desc: "Kuralları okumadan XP kazanın, profil stillerini açın ve ilerlemenizi gösterin.",
      verification_submit_title: "Doğrulama İsteği Gönder",
      verification_submit_desc: "Lütfen resmi websiteleri veya belgeler gibi kimlik kanıtları sağlayın ve neden onaylanmanız gerektiğini belirtin.",
      settings_username_hint: "3-24 harf, sayı veya alt çizgi. Kullanıcı adları küçük harfle kaydedilir.",
      settings_bio_placeholder: "Bize kendinizden bahsedin...",
      settings_location_placeholder: "Şehir, Ülke",
      settings_photo_hint: "5 MB'a kadar JPG, PNG, GIF veya WebP yükleyin.",
      settings_remove_photo: "Mevcut fotoğrafı kaldır ve varsayılan avatarı kullan",
      settings_banner_hint: "Profilinizdeki afişi ve sohbet başlığınızda kullanılan rengi değiştirir.",
      settings_banner_locked_hint: "Profil renkleri LvL 20'de açılır. O zamana kadar ödül renklerinin anlamlı kalması için hesaplar siyah beyaz kalır.",
      settings_banner_earn_xp: "Gönderi paylaşarak, yorum yaparak, beğenerek ve sohbetlere katılarak XP kazanın.",
      settings_banner_see_table: "LvL ödül tablosuna göz atın.",
      settings_delete_prefix: "Onaylamak için",
      settings_delete_suffix: "yazın",
      achievement_elite_champion_name: "Elit Şampiyon", achievement_elite_champion_desc: "LvL 20'ye ulaş.",
      achievement_mythic_legend_name: "Efsane", achievement_mythic_legend_desc: "LvL 30'a ulaş.",
      activity_kicker: "Geçmişiniz",
      activity_title: "Aktivite",
      activity_desc: "Yakın zamanda etkileşime girdiğiniz gönderiler, yanıtlar, beğeniler, paylaşımlar ve klipler.",
      activity_empty_title: "Henüz burada bir şey yok",
      activity_empty_desc: "LvL geçmişinizi oluşturmak için gönderi paylaşın, yorum yapın, beğenin, yeniden paylaşın veya klip yükleyin.",
      activity_type_post: "Gönderi",
      activity_type_comment: "Yorum",
      activity_type_like: "Beğeni",
      activity_type_repost: "Paylaşım",
      activity_type_reel: "Klip",
      activity_desc_picture: "Görsel gönderisi",
      activity_desc_like: "Bir gönderiyi beğendiniz.",
      activity_desc_repost: "Ağınızla bir şey paylaştınız.",
      activity_desc_reel: "Bir klip yüklediniz.",
''',
    'ar': '''
      guide_header_desc: "اربح النقاط وافتح أنماط الملف الشخصي واجعل تقدمك مرئياً بدون قراءة كتاب القواعد.",
      verification_submit_title: "إرسال طلب التوثيق",
      verification_submit_desc: "يرجى تقديم إثبات الهوية، مثل روابط للمواقع الرسمية أو تحميل المستندات، واذكر سبب وجوب توثيق حسابك.",
      settings_username_hint: "3-24 حرفاً، أرقاماً، أو شرطات سفلية. تُحفظ بأسماء صغيرة.",
      settings_bio_placeholder: "أخبرنا عن نفسك...",
      settings_location_placeholder: "المدينة، البلد",
      settings_photo_hint: "قم بتحميل JPG أو PNG أو GIF أو WebP بحجم يصل إلى 5 ميغابايت.",
      settings_remove_photo: "إزالة الصورة الحالية واستخدام الصورة الافتراضية",
      settings_banner_hint: "يغير الغلاف في ملفك الشخصي واللون المستخدم في رأس الدردشة الخاصة بك.",
      settings_banner_locked_hint: "تُفتح ألوان الملف الشخصي في المستوى 20. حتى ذلك الحين، تبقى الحسابات باللونين الأبيض والأسود لتظل ألوان المكافآت ذات معنى.",
      settings_banner_earn_xp: "اربح النقاط من خلال النشر والتعليق والإعجاب والمشاركة في المحادثات.",
      settings_banner_see_table: "انظر إلى جدول مكافآت المستوى.",
      settings_delete_prefix: "اكتب",
      settings_delete_suffix: "للتأكيد",
      achievement_elite_champion_name: "بطل النخبة", achievement_elite_champion_desc: "صل إلى المستوى 20.",
      achievement_mythic_legend_name: "أسطورة", achievement_mythic_legend_desc: "صل إلى المستوى 30.",
      activity_kicker: "سجلك",
      activity_title: "النشاط",
      activity_desc: "المنشورات والردود والإعجابات والمشاركات والمقاطع التي تفاعلت معها مؤخراً.",
      activity_empty_title: "لا يوجد شيء هنا بعد",
      activity_empty_desc: "انشر، علق، أعجب، أعد النشر، أو ارفع مقطعاً لبناء سجل المستوى الخاص بك.",
      activity_type_post: "منشور",
      activity_type_comment: "تعليق",
      activity_type_like: "إعجاب",
      activity_type_repost: "مشاركة",
      activity_type_reel: "مقطع",
      activity_desc_picture: "منشور صورة",
      activity_desc_like: "أعجبت بمنشور.",
      activity_desc_repost: "قمت بمشاركة شيء لشبكتك.",
      activity_desc_reel: "قمت برفع مقطع.",
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

print("Final keys injected successfully.")
